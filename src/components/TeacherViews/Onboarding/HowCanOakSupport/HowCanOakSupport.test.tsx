import { screen } from "@testing-library/dom";

import HowCanOakSupport, { oakSupportMap } from "./HowCanOakSupport.view";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

describe("HowCanOakSupport", () => {
  it("renders the onboarding layout with the correct prompt", () => {
    renderWithProviders()(<HowCanOakSupport />);
    const promptHeading = screen.getByText(/Last step.../i);
    expect(promptHeading).toBeInTheDocument();
    const promptBody = screen.getByText(
      /Tell us a little bit about you so we can tailor Oak to suit your needs./i,
    );
    expect(promptBody).toBeInTheDocument();
  });
  it('renders checkboxes for each key in "oakSupportMap"', () => {
    renderWithProviders()(<HowCanOakSupport />);
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(Object.keys(oakSupportMap).length);
  });
  it("renders a continue button that is enabled by default", () => {
    renderWithProviders()(<HowCanOakSupport />);
    const continueButton = screen.getByRole("button", { name: /continue/i });
    expect(continueButton).toBeEnabled();
  });
});
