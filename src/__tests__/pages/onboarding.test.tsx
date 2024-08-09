import { screen } from "@testing-library/dom";

import renderWithProviders from "../__helpers__/renderWithProviders";

import theme from "@/styles/theme";
import OnboardingPage from "@/pages/onboarding";

jest.mock("posthog-js/react", () => ({
  useFeatureFlagEnabled: () => true,
}));
describe("onboarding page", () => {
  test("it renders the onboarding page", () => {
    renderWithProviders({
      user: { user: {} },
      theme: { theme },
    })(<OnboardingPage />);

    const heading = screen.getByRole("heading", { name: "Select your school" });
    expect(heading).toBeInTheDocument();
  });
});
