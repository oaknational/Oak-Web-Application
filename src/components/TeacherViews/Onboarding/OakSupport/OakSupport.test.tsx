import { screen } from "@testing-library/dom";

import OakSupport, { oakSupportMap } from "./OakSupport.view";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

describe("OakSupport", () => {
  it("renders the onboarding layout with the correct prompt", () => {
    renderWithProviders()(<OakSupport />);
    const promptHeading = screen.getByText(/Last step.../i);
    expect(promptHeading).toBeInTheDocument();
    const promptBody = screen.getByText(
      /Tell us a little bit about you so we can tailor Oak to suit your needs./i,
    );
    expect(promptBody).toBeInTheDocument();
  });
  it('renders checkboxes for each key in "oakSupportMap"', () => {
    renderWithProviders()(<OakSupport />);
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(Object.keys(oakSupportMap).length);
  });
  it("renders a continue button that is enabled by default", () => {
    renderWithProviders()(<OakSupport />);
    const continueButton = screen.getByRole("button", { name: /continue/i });
    expect(continueButton).toBeEnabled();
  });
});
