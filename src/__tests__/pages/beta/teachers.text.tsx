import { screen } from "@testing-library/react";

import Teachers from "../../../pages/beta/teachers";
import renderWithProviders from "../../__helpers__/renderWithProviders";

describe("pages/beta/teachers.tsx", () => {
  test("it renders correct title", () => {
    renderWithProviders(<Teachers />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "Teachers homepage"
    );
  });
});
