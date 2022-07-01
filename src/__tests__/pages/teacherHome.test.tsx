import { screen, waitFor } from "@testing-library/react";

import TeacherHome from "../../pages/beta/teacher";
import renderWithProviders from "../__helpers__/renderWithProviders";

describe("pages/teacherHome.tsx", () => {
  it("Renders correct title ", async () => {
    renderWithProviders(<TeacherHome />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
        "Teacher Home"
      );
    });
  });
});
