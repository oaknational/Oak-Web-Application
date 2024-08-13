import { screen } from "@testing-library/dom";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import RoleSelection from "@/pages/onboarding/role-selection";
jest.mock("posthog-js/react", () => ({
  useFeatureFlagEnabled: () => true,
}));
describe("Onboarding view", () => {
  it("renders a Continue button", async () => {
    renderWithProviders()(<RoleSelection />);
    const roleSelection = await screen.findByText("Role selection");
    expect(roleSelection).toBeInTheDocument();
  });
});
