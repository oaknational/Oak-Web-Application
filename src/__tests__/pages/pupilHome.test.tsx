import { screen, waitFor } from "@testing-library/react";

import PupilHome from "../../pages/pupilHome";
import renderWithProviders from "../__helpers__/renderWithProviders";

describe("pages/pupilHome.tsx", () => {
  it("Renders correct title ", async () => {
    renderWithProviders(<PupilHome />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
        "Pupil Home"
      );
    });
  });
});
