import { screen } from "@testing-library/dom";

import RoleSelectionPage from "@/pages/onboarding/role-selection";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

jest.mock("posthog-js/react", () => ({
  useFeatureFlagEnabled: () => true,
}));
describe("onboarding page", () => {
  test("it renders the role selection page", () => {
    renderWithProviders()(<RoleSelectionPage />);

    const heading = screen.getByText("Continue");
    expect(heading).toBeInTheDocument();
  });
});
