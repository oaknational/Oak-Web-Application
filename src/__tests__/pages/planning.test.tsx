import { screen, waitFor } from "@testing-library/react";

import Planning from "../../pages/planning";
import renderWithProviders from "../__helpers__/renderWithProviders";

describe("pages/planning.tsx", () => {
  it("Renders correct title ", async () => {
    renderWithProviders(<Planning />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
        "Save time planning your lessons with free, adaptable teacher-made resources"
      );
    });
  });
});
