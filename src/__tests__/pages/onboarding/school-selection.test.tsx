import { screen } from "@testing-library/dom";

import renderWithProviders from "../../__helpers__/renderWithProviders";

import SchoolSelection from "@/pages/onboarding/school-selection";

jest.mock("posthog-js/react", () => ({
  useFeatureFlagEnabled: () => true,
}));

jest.mock("next/navigation", () => require("next-router-mock"));

describe("Onboarding school selection page", () => {
  test("it renders the onboarding page", () => {
    renderWithProviders()(<SchoolSelection />);

    const heading = screen.getByText("Select your school");
    expect(heading).toBeInTheDocument();
  });
});
