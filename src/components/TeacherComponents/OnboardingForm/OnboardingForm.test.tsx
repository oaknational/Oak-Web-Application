import { screen } from "@testing-library/dom";

import OnboardingForm from "./OnboardingForm";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

describe("Onboarding form", () => {
  it("should render the onboarding form", async () => {
    const handleSubmitMock = jest.fn();
    const formStateMock = {
      errors: {},
      isDirty: false,
      isLoading: false,
      isValid: true,
      isSubmitted: false,
      isSubmitting: false,
      isSubmitSuccessful: false,
      isValidating: false,
      disabled: false,
      touchedFields: {},
      dirtyFields: {},
      submitCount: 0,
      validatingFields: {},
    };
    renderWithProviders()(
      <OnboardingForm
        handleSubmit={handleSubmitMock}
        formState={formStateMock}
        heading="Select your school"
      >
        <div />
      </OnboardingForm>,
    );
    const heading = await screen.findByRole("heading", {
      name: "Select your school",
    });
    expect(heading).toBeInTheDocument();
  });
});
