import { screen, waitFor } from "@testing-library/react";

import Home from "../../pages";
import renderWithProviders from "../__helpers__/renderWithProviders";

const testLesson = { id: 1, title: "Physics only review", slug: "lesson-slug" };
describe("pages/index.tsx", () => {
  it("Renders lesson title ", async () => {
    renderWithProviders(<Home lesson={testLesson} />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
        testLesson.title
      );
    });
  });
});
