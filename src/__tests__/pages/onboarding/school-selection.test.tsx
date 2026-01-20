import { screen } from "@testing-library/dom";

import renderWithProviders from "../../__helpers__/renderWithProviders";

import SchoolSelection from "@/pages/onboarding/school-selection";
import { mockLoggedIn } from "@/__tests__/__helpers__/mockUser";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";

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
