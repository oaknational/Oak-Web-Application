import { screen } from "@testing-library/react";

import TeacherHome from "../../pages/beta/teacher";
import renderWithProviders from "../__helpers__/renderWithProviders";

describe("pages/teacherHome.tsx", () => {
  it("Renders correct title ", async () => {
    renderWithProviders(<TeacherHome />);

    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "Big inspiring heading"
    );
  });
});
