import { vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/dom";
import { DefaultValues, useForm } from "react-hook-form";
import { renderHook } from "@testing-library/react";
import userEvent, {
  PointerEventsCheckLevel,
} from "@testing-library/user-event";
import mockRouter from "next-router-mock";
import createFetchMock from "vitest-fetch-mock";

import OnboardingForm from "./OnboardingForm";
import { OnboardingFormProps } from "./OnboardingForm.schema";
import * as onboardingActions from "./onboardingActions";
import { onboardUser } from "./onboardingActions";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { mockLoggedIn } from "@/__tests__/__helpers__/mockUser";
import type { OnboardingSchema } from "@/common-lib/schemas/onboarding";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";

const setEmailInLocalStorage = vi.fn();
const setSchoolInLocalStorage = vi.fn();
const setTermsInLocalStorage = vi.fn();

vi.mock("../hooks/downloadAndShareHooks/useLocalStorageForDownloads", () => {
  return {
    default: vi.fn(() => ({
      setEmailInLocalStorage,
      setSchoolInLocalStorage,
      setTermsInLocalStorage,
    })),
  };
});

vi.mock("@/browser-lib/hubspot/forms");
vi.mock("./onboardingActions", async () => ({
  ...(await vi.importActual("./onboardingActions")),
  onboardUser: vi.fn(),
}));

type OnboardingFormState = DefaultValues<OnboardingFormProps>;

const fetchMocker = createFetchMock(vi);

describe("Onboarding form", () => {
  beforeAll(() => {
    fetchMocker.enableMocks();
  });
  afterAll(() => {
    fetchMocker.disableMocks();
  });
  beforeEach(() => {
    setUseUserReturn(mockLoggedIn);
  });

  it("should render the onboarding form with fieldset and legend", async () => {
    renderForm();

    const fieldset = screen.getByRole("fieldset");
    expect(fieldset).toBeInTheDocument();
    const legend = screen.getByText(/Select your school/i);
    expect(legend).toBeInTheDocument();

    expect(fieldset).toContainElement(legend);
  });

  it("renders newsletter signup checkbox", async () => {
    fetchMock.mockResponse(JSON.stringify(false));
    renderForm({}, false);

    expect(
      await screen.findByLabelText(
        "Sign up for our latest resources and updates by email. Unsubscribe at any time",
      ),
    ).toBeInTheDocument();
  });
  it("should render the Controller component and handle checkbox change", async () => {
    fetchMock.mockResponse(JSON.stringify(false));
    renderForm({}, false);

    const checkbox = await screen.findByRole("checkbox", {
      name: /Sign up for our latest resources and updates by email. Unsubscribe at any time/i,
    });
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);

    expect(checkbox).toBeChecked();
  });

  it.each<[string, string, boolean]>([
    ["/onboarding/school-selection", "works in a school", true],
    ["/onboarding/role-selection", "does not work in a school", false],
  ])(
    "redirects to %p when the user %s",
    async (pathname, __, worksInSchool) => {
      mockRouter.setCurrentUrl("/onboarding?returnTo=/home");

      await submitForm({ worksInSchool });

      expect(mockRouter.route).toEqual(pathname);
      expect(mockRouter.query.returnTo).toEqual("/home");
    },
  );

  describe.each<[string, OnboardingFormState, OnboardingSchema]>([
    ["of school selection", { school: "Grange Hill" }, { isTeacher: true }],
    [
      "of manual school selection",
      { manualSchoolName: "Grange Hill" },
      { isTeacher: true },
    ],
    ["of role selection", { role: "teacher-trainer" }, { isTeacher: false }],
  ])("on submit %s", (__, formState, onboardingPayload) => {
    beforeEach(() => {
      mockRouter.setCurrentUrl("/onboarding?returnTo=/downloads");
    });

    afterEach(() => {
      vi.spyOn(onboardingActions, "onboardUser").mockReset();
    });

    it("only allows the form to be submitted once", async () => {
      renderForm(formState);

      const continueButton = screen.getByText("Continue");
      await userEvent.click(continueButton);
      await userEvent.click(continueButton, {
        pointerEventsCheck: PointerEventsCheckLevel.EachTarget,
      });

      expect(onboardingActions.onboardUser).toHaveBeenCalledTimes(1);
    });

    it("onboards the user through Clerk", async () => {
      await submitForm(formState);

      expect(onboardingActions.onboardUser).toHaveBeenCalledWith(
        onboardingPayload,
      );
    });

    it("redirects the user back to the page they came from", async () => {
      vi.spyOn(onboardingActions, "onboardUser").mockResolvedValue({
        owa: { isTeacher: true, isOnboarded: true },
      });

      await submitForm(formState);

      await waitFor(() => {
        expect(mockRouter.asPath).toEqual("/downloads");
      });
    });

    describe("when Clerk onboarding fails", () => {
      beforeEach(() => {
        vi.spyOn(onboardingActions, "onboardUser").mockRejectedValue(
          new Error(),
        );
      });

      it("displays an error", async () => {
        await submitForm(formState);

        expect(
          screen.getByText("Something went wrong. Please try again."),
        ).toBeInTheDocument();
      });

      it("allows the form to be submitted again", async () => {
        await submitForm(formState);

        expect(screen.getByRole("button", { name: /Continue/ })).toBeEnabled();
      });
    });
    describe("local storage is updated with onboarding data", () => {
      it("email and terms is set in local storage if ", async () => {
        fetchMock.mockResponse(JSON.stringify(true));

        vi.spyOn(onboardingActions, "onboardUser").mockResolvedValue({
          owa: { isTeacher: true, isOnboarded: true },
        });

        await submitForm(formState, false);

        await waitFor(() =>
          expect(setEmailInLocalStorage).toHaveBeenCalledWith("test-email"),
        );
        await waitFor(() =>
          expect(setTermsInLocalStorage).toHaveBeenCalledWith(true),
        );
      });
      it("school is set in local storage", async () => {
        fetchMock.mockResponse(JSON.stringify(true));
        vi.mocked(onboardUser).mockResolvedValue({
          owa: { isTeacher: true, isOnboarded: true },
        });

        await submitForm(formState, false);

        expect(setSchoolInLocalStorage).toHaveBeenCalledWith({
          schoolId: "Grange Hill",
          schoolName: "Grange Hill",
        });
      });
    });
  });
});

function renderForm(
  formState: OnboardingFormState = { newsletterSignUp: true },
  forceHideNewsletterSignUp: boolean = true,
) {
  const { result } = renderHook(() =>
    useForm<OnboardingFormProps>({
      defaultValues: formState,
    }),
  );

  renderWithProviders()(
    <OnboardingForm
      handleSubmit={result.current.handleSubmit}
      formState={result.current.formState}
      heading="Select your school"
      canSubmit={true}
      trigger={result.current.trigger}
      control={result.current.control}
      forceHideNewsletterSignUp={forceHideNewsletterSignUp}
    >
      <div />
    </OnboardingForm>,
  );
}

async function submitForm(
  formState: OnboardingFormState,
  forceHideNewsletterSignUp?: boolean,
) {
  renderForm(formState, forceHideNewsletterSignUp);

  await userEvent.setup().click(screen.getByText("Continue"));
}
