import { screen } from "@testing-library/dom";
import { useUser } from "@clerk/nextjs";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import RoleSelectionPage from "@/pages/onboarding/role-selection";
import * as featureFlaggedClerk from "@/context/FeatureFlaggedClerk/FeatureFlaggedClerk";

jest.mock("@/context/FeatureFlaggedClerk/FeatureFlaggedClerk");
jest.mock("posthog-js/react", () => ({
  useFeatureFlagEnabled: () => true,
}));

describe("Onboarding role selection page", () => {
  beforeEach(() => {
    jest.spyOn(featureFlaggedClerk, "useFeatureFlaggedClerk").mockReturnValue({
      ...featureFlaggedClerk.fakeClerkApi,
      useUser: () =>
        ({ user: {}, isLoaded: true, isSignedIn: true }) as ReturnType<
          typeof useUser
        >,
    });
  });

  it("should render the onboarding role selection page", async () => {
    renderWithProviders()(<RoleSelectionPage />);
    const heading = await screen.findByText(
      "Which of the following best describes what you do?",
    );

    expect(heading).toBeInTheDocument();
  });
});
