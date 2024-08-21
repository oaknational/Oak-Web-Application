import { fireEvent, screen, waitFor } from "@testing-library/dom";
import { DefaultValues, useForm } from "react-hook-form";
import { renderHook } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockRouter from "next-router-mock";

import OnboardingForm from "./OnboardingForm";
import { OnboardingFormProps } from "./OnboardingForm.schema";
import * as onboardingActions from "./onboardingActions";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { mockLoggedIn } from "@/__tests__/__helpers__/mockUser";
import type { OnboardingSchema } from "@/common-lib/schemas/onboarding";

jest.mock("@/browser-lib/hubspot/forms");
jest.mock("./onboardingActions");
jest.mock("@clerk/nextjs", () => {
  return {
    useUser() {
      return mockLoggedIn;
    },
  };
});

type OnboardingFormState = DefaultValues<OnboardingFormProps>;

describe("Onboarding form", () => {
  it("should render the onboarding form with fieldset and legend", async () => {
    renderForm();

    const fieldset = screen.getByRole("fieldset");
    expect(fieldset).toBeInTheDocument();
    const legend = screen.getByText(/Select your school/i);
    expect(legend).toBeInTheDocument();

    expect(fieldset).toContainElement(legend);
  });

  it("renders newsletter signup checkbox", () => {
    renderForm();

    expect(
      screen.getByLabelText(
        "Sign up to receive helpful content via email. Unsubscribe at any time.",
      ),
    ).toBeInTheDocument();
  });
  it("should render the Controller component and handle checkbox change", async () => {
    renderForm();

    const checkbox = await screen.findByRole("checkbox", {
      name: /Sign up to receive helpful content via email. Unsubscribe at any time./i,
    });
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);

    expect(checkbox).not.toBeChecked();
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

    it("onboards the user through Clerk", async () => {
      jest.spyOn(onboardingActions, "onboardUser");

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
      it("displays an error", async () => {
        jest
          .spyOn(onboardingActions, "onboardUser")
          .mockRejectedValue(new Error());

        await submitForm(formState);

        expect(
          screen.getByText("Something went wrong. Please try again."),
        ).toBeInTheDocument();
      });
    });
  });
});

function renderForm(
  formState: OnboardingFormState = { newsletterSignUp: true },
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
    >
      <div />
    </OnboardingForm>,
  );
}

async function submitForm(formState: OnboardingFormState) {
  renderForm(formState);

  await userEvent.setup().click(screen.getByText("Continue"));
}
