import { screen } from "@testing-library/dom";
import { useUser } from "@clerk/nextjs";

import renderWithProviders from "../../__helpers__/renderWithProviders";

import SchoolSelection from "@/pages/onboarding/school-selection";
import * as featureFlaggedClerk from "@/context/FeatureFlaggedClerk/FeatureFlaggedClerk";

jest.mock("@/context/FeatureFlaggedClerk/FeatureFlaggedClerk");
jest.mock("posthog-js/react", () => ({
  useFeatureFlagEnabled: () => true,
}));

describe("Onboarding school selection page", () => {
  beforeEach(() => {
    jest.spyOn(featureFlaggedClerk, "useFeatureFlaggedClerk").mockReturnValue({
      ...featureFlaggedClerk.fakeClerkApi,
      useUser: () =>
        ({ user: {}, isLoaded: true, isSignedIn: true }) as ReturnType<
          typeof useUser
        >,
    });
  });

  test("it renders the onboarding page", () => {
    renderWithProviders()(<SchoolSelection />);

    const heading = screen.getByText("Select your school");
    expect(heading).toBeInTheDocument();
  });
});
