import { screen } from "@testing-library/react";

import PupilHome from "../../pages/beta/pupil";
import renderWithProviders from "../__helpers__/renderWithProviders";

describe("pages/pupilHome.tsx", () => {
  it("Renders correct title ", () => {
    renderWithProviders(<PupilHome />);

    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "Pupil Home"
    );
  });
});
