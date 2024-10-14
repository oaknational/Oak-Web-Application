import { screen } from "@testing-library/dom";

import OnboardingPage from "@/pages/onboarding";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { mockLoggedIn } from "@/__tests__/__helpers__/mockUser";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";

jest.mock("posthog-js/react", () => ({
  useFeatureFlagEnabled: () => true,
}));

jest.mock("next/navigation", () => require("next-router-mock"));

describe("onboarding page", () => {
  test("it renders the onboarding page", () => {
    setUseUserReturn(mockLoggedIn);

    renderWithProviders()(<OnboardingPage />);

    const heading = screen.getByText("Do you work in a school?");
    expect(heading).toBeInTheDocument();
  });
});
