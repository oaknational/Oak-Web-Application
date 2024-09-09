import { screen } from "@testing-library/dom";

import OakSupport from "./OakSupport.view";

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
});
