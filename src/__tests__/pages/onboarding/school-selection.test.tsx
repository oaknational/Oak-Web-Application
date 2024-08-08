import { screen } from "@testing-library/dom";

import renderWithProviders from "../../__helpers__/renderWithProviders";

import SchoolSelection from "@/pages/onboarding/school-selection";

jest.mock("posthog-js/react", () => ({
  useFeatureFlagEnabled: () => true,
}));
describe("Onboarding school selection page", () => {
  test("it renders the onboarding page", () => {
    renderWithProviders()(<SchoolSelection />);

    const heading = screen.getByRole("heading", { name: "Select your school" });
    expect(heading).toBeInTheDocument();
  });
});
