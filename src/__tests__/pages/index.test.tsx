import { screen, waitFor } from "@testing-library/react";

import Home from "../../pages";
import renderWithProviders from "../__helpers__/renderWithProviders";

describe("pages/index.tsx", () => {
  it("Renders correct title ", async () => {
    renderWithProviders(<Home />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
        "Supporting Schools To Build Their Curriculum"
      );
    });
  });
});
