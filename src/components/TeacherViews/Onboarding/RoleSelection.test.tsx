import { screen } from "@testing-library/dom";

import OnboardingView from "./Onboarding.view";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

describe("Onboarding view", () => {
  it("renders a heading", async () => {
    renderWithProviders()(<OnboardingView />);
    const heading = await screen.findByRole("heading", {
      name: "Select your school",
    });
    expect(heading).toBeInTheDocument();
  });

  it("renders a Continue button", async () => {
    renderWithProviders()(<OnboardingView />);
    const continueButton = await screen.findByRole("button", {
      name: "Continue",
    });
    expect(continueButton).toBeInTheDocument();
    expect(continueButton).toBeDisabled();
  });
});
