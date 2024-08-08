import { fireEvent, screen } from "@testing-library/dom";
import { DefaultValues, useForm } from "react-hook-form";
import { renderHook } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import OnboardingForm from "./OnboardingForm";
import { OnboardingFormProps } from "./OnboardingForm.schema";
import * as onboardingActions from "./onboardingActions";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { mockLoggedIn } from "@/__tests__/__helpers__/mockUser";

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

  describe.each<[string, OnboardingFormState]>([
    ["of school selection", { school: "Grange Hill" }],
    ["of role selection", { role: "teacher-trainer" }],
  ])("on submit %s", (__, formState) => {
    it("onboards the user through Clerk", async () => {
      jest.spyOn(onboardingActions, "onboardUser");

      await submitForm(formState);

      expect(onboardingActions.onboardUser).toHaveBeenCalled();
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

    async function submitForm(formState: OnboardingFormState) {
      renderForm(formState);

      await userEvent.setup().click(screen.getByText("Continue"));
    }
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
