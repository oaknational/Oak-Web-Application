import { screen } from "@testing-library/react";

import OnBoarding from "../../pages/beta/onboarding";
import renderWithProviders from "../__helpers__/renderWithProviders";

describe("pages/onBoarding.tsx", () => {
  it("Renders correct title ", () => {
    renderWithProviders(<OnBoarding />);

    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "Use Oak as a:"
    );
  });
});
