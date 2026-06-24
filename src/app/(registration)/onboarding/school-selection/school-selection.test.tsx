import { screen } from "@testing-library/dom";

import SchoolSelection from "./page";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { mockLoggedIn } from "@/__tests__/__helpers__/mockUser";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";

jest.mock("posthog-js/react", () => ({
  useFeatureFlagVariantKey: () => "with-login",
  useFeatureFlagEnabled: () => false,
}));

jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  usePathname: jest.fn(() => "/onboarding"),
}));

describe("Onboarding school selection page", () => {
  beforeEach(() => {
    setUseUserReturn(mockLoggedIn);
  });

  test("it renders the onboarding page", () => {
    renderWithProviders()(<SchoolSelection />);

    const heading = screen.getByText("Select your school");
    expect(heading).toBeInTheDocument();
  });
});
