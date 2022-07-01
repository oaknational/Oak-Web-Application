import { screen, waitFor } from "@testing-library/react";

import Beta from "../../pages/beta/beta";
import renderWithProviders from "../__helpers__/renderWithProviders";

describe("pages/beta.tsx", () => {
  it("Renders correct title ", async () => {
    renderWithProviders(<Beta />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
        "Oak National Academy BETA"
      );
    });
  });
});
