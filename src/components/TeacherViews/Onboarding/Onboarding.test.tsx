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
  it("renders terms and conditions text", () => {
    renderWithProviders()(<OnboardingView />);
    const tsAndCs = screen.getByText("Oak's terms & conditions", {
      exact: false,
    });
    expect(tsAndCs).toBeInTheDocument();
    expect(tsAndCs).toHaveAttribute("href", "/legal/terms-and-conditions");
  });
  it("renders contact us text", () => {
    renderWithProviders()(<OnboardingView />);
    const contactUs = screen.getByText("Contact us", { exact: false });
    expect(contactUs).toBeInTheDocument();
    expect(contactUs).toHaveAttribute("href", "/contact-us");
  });
});
