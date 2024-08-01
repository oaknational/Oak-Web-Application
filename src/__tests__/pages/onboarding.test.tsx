import { screen } from "@testing-library/dom";

import renderWithProviders from "../__helpers__/renderWithProviders";

import OnboardingPage from "@/pages/onboarding";

jest.mock("posthog-js/react", () => ({
  useFeatureFlagEnabled: () => true,
}));
describe("onboarding page", () => {
  test("it renders the onboarding page", () => {
    renderWithProviders()(<OnboardingPage />);

    const heading = screen.getByRole("heading", { name: "Onboarding" });
    expect(heading).toBeInTheDocument();
  });
});
