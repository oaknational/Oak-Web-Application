import { fireEvent, screen, waitFor } from "@testing-library/dom";
import { DefaultValues, useForm } from "react-hook-form";
import { renderHook } from "@testing-library/react";
import userEvent, {
  PointerEventsCheckLevel,
} from "@testing-library/user-event";
import mockRouter from "next-router-mock";
import fetchMock from "jest-fetch-mock";

import OnboardingForm from "./OnboardingForm";
import { OnboardingFormProps } from "./OnboardingForm.schema";
import * as onboardingActions from "./onboardingActions";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { mockLoggedIn } from "@/__tests__/__helpers__/mockUser";
import type { OnboardingSchema } from "@/common-lib/schemas/onboarding";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";

const setEmailInLocalStorage = jest.fn();
const setSchoolInLocalStorage = jest.fn();
const setTermsInLocalStorage = jest.fn();

jest.mock("../hooks/downloadAndShareHooks/useLocalStorageForDownloads", () => {
  return jest.fn(() => ({
    setEmailInLocalStorage,
    setSchoolInLocalStorage,
    setTermsInLocalStorage,
  }));
});

jest.mock("@/browser-lib/hubspot/forms");
jest.mock("./onboardingActions", () => {
  const actual = jest.requireActual("./onboardingActions");
  return {
    ...actual,
    onboardUser: jest.fn(),
  };
});
jest.mock("@clerk/nextjs");

type OnboardingFormState = DefaultValues<OnboardingFormProps>;

describe("Onboarding form", () => {
  beforeAll(() => {
    fetchMock.enableMocks();
  });
  afterAll(() => {
    fetchMock.disableMocks();
  });
  beforeEach(() => {
    setUseUserReturn(mockLoggedIn);
  });

  it("should render the onboarding form with fieldset and legend", async () => {
    renderForm();

    const legend = screen.getByText(/Select your school/i);
    expect(legend).toBeInTheDocument();
    const fieldset = legend.closest("fieldset");

    expect(fieldset).toBeInTheDocument();
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
      jest.spyOn(onboardingActions, "onboardUser").mockReset();
    });

    it("only allows the form to be submitted once", async () => {
      renderForm(formState);

      const continueButton = screen.getByText("Continue");
      await userEvent.click(continueButton, {
        pointerEventsCheck: PointerEventsCheckLevel.Never,
      });
      await userEvent.click(continueButton, {
        pointerEventsCheck: PointerEventsCheckLevel.Never,
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
      jest
        .spyOn(onboardingActions, "onboardUser")
        .mockResolvedValue({ owa: { isTeacher: true, isOnboarded: true } });

      await submitForm(formState);

      await waitFor(() => {
        expect(mockRouter.asPath).toEqual("/downloads");
      });
    });

    describe("when Clerk onboarding fails", () => {
      beforeEach(() => {
        jest
          .spyOn(onboardingActions, "onboardUser")
          .mockRejectedValue(new Error());
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

        jest
          .spyOn(onboardingActions, "onboardUser")
          .mockResolvedValue({ owa: { isTeacher: true, isOnboarded: true } });

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
        jest
          .spyOn(onboardingActions, "onboardUser")
          .mockResolvedValue({ owa: { isTeacher: true, isOnboarded: true } });

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
  const continueButton = screen.getByRole("button", { name: "Continue" });
  // see https://github.com/testing-library/user-event/issues/662
  await userEvent.click(continueButton, { pointerEventsCheck: 0 });
}
