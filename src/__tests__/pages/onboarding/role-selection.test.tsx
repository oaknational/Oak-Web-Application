import { screen } from "@testing-library/dom";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import RoleSelectionPage from "@/pages/onboarding/role-selection";
import { mockLoggedIn } from "@/__tests__/__helpers__/mockUser";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";

describe("Onboarding role selection page", () => {
  beforeEach(() => {
    setUseUserReturn(mockLoggedIn);
  });

  it("should render the onboarding role selection page", async () => {
    renderWithProviders()(<RoleSelectionPage />);
    const heading = await screen.findByText(
      "Which of the following best describes what you do?",
    );

    expect(heading).toBeInTheDocument();
  });
});
