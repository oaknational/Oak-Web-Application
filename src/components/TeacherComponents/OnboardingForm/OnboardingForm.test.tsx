import { fireEvent, screen } from "@testing-library/dom";
import { useForm } from "react-hook-form";
import { renderHook } from "@testing-library/react";

import OnboardingForm from "./OnboardingForm";
import { OnboardingFormProps } from "./OnboardingForm.schema";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

describe("Onboarding form", () => {
  it("should render the onboarding form", async () => {
    const { result } = renderHook(() => useForm<OnboardingFormProps>());
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
    const heading = await screen.findByRole("heading", {
      name: "Select your school",
    });
    expect(heading).toBeInTheDocument();
  });
  it("renders newsletter signup checkbox", () => {
    const { result } = renderHook(() => useForm<OnboardingFormProps>());

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
    expect(
      screen.getByLabelText(
        "Sign up to receive helpful content via email. Unsubscribe at any time.",
      ),
    ).toBeInTheDocument();
  });
  it("should render the Controller component and handle checkbox change", async () => {
    const { result } = renderHook(() =>
      useForm<OnboardingFormProps>({
        defaultValues: { newsletterSignUp: true },
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

    const checkbox = await screen.findByRole("checkbox", {
      name: /Sign up to receive helpful content via email. Unsubscribe at any time./i,
    });
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);

    expect(checkbox).not.toBeChecked();
  });
});
