import { screen } from "@testing-library/dom";

import OnboardingPage from "@/pages/onboarding";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { mockNotOnboardedUser } from "@/__tests__/__helpers__/mockUser";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";

jest.mock("posthog-js/react", () => ({
  useFeatureFlagVariantKey: () => "with-login",
  useFeatureFlagEnabled: () => false,
}));

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/onboarding"),
  useRouter: jest.fn().mockReturnValue({ push: jest.fn() }),
  useSearchParams: jest.fn(),
}));

describe("onboarding page", () => {
  test("it renders the onboarding page", () => {
    setUseUserReturn(mockNotOnboardedUser);

    renderWithProviders()(<OnboardingPage />);

    const heading = screen.getByText("Do you work in a school?");
    expect(heading).toBeInTheDocument();
  });
});
