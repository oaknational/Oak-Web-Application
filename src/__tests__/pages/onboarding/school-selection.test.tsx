import { screen } from "@testing-library/dom";

import SchoolSelectionPage from "@/pages/onboarding/school-selection";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

jest.mock("posthog-js/react", () => ({
  useFeatureFlagEnabled: () => true,
}));
describe("onboarding page", () => {
  test("it renders the onboarding page", () => {
    renderWithProviders()(<SchoolSelectionPage />);

    const heading = screen.getByText("Continue");
    expect(heading).toBeInTheDocument();
  });
});
