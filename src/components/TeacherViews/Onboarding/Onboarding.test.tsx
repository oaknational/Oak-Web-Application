import { screen } from "@testing-library/dom";

import OnboardingView from "./Onboarding.view";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

describe("Onboarding view", () => {
  it("renders a heading", () => {
    renderWithProviders()(<OnboardingView />);
    const heading = screen.getByRole("heading", { name: "Select your school" });
    expect(heading).toBeInTheDocument();
  });
  it("renders a school picker", () => {
    renderWithProviders()(<OnboardingView />);
    const schoolPicker = screen.getByTestId("search-combobox-input");
    expect(schoolPicker).toBeInTheDocument();
  });
  it("renders a Continue button", () => {
    renderWithProviders()(<OnboardingView />);
    const continueButton = screen.getByRole("button", { name: "Continue" });
    expect(continueButton).toBeInTheDocument();
    expect(continueButton).toBeDisabled();
  });
});
