import { screen } from "@testing-library/dom";
import { useUser } from "@clerk/nextjs";

import OnboardingPage from "@/pages/onboarding";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import * as featureFlaggedClerk from "@/context/FeatureFlaggedClerk/FeatureFlaggedClerk";

jest.mock("@/context/FeatureFlaggedClerk/FeatureFlaggedClerk");
jest.mock("posthog-js/react", () => ({
  useFeatureFlagEnabled: () => true,
}));

describe("onboarding page", () => {
  test("it renders the onboarding page", () => {
    jest.spyOn(featureFlaggedClerk, "useFeatureFlaggedClerk").mockReturnValue({
      ...featureFlaggedClerk.fakeClerkApi,
      useUser: () =>
        ({ user: {}, isLoaded: true, isSignedIn: true }) as ReturnType<
          typeof useUser
        >,
    });

    renderWithProviders()(<OnboardingPage />);

    const heading = screen.getByText("Do you work in a school?");
    expect(heading).toBeInTheDocument();
  });
});
