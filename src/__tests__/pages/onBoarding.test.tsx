import { screen, waitFor } from "@testing-library/react";

import OnBoarding from "../../pages/onBoarding";
import renderWithProviders from "../__helpers__/renderWithProviders";

describe("pages/beta.tsx", () => {
  it("Renders correct title ", async () => {
    renderWithProviders(<OnBoarding />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
        "Use Oak as a:"
      );
    });
  });
});
