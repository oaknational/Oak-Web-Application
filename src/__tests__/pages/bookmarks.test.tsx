import { screen, waitFor } from "@testing-library/react";

import Home from "../../pages";
import renderWithProviders from "../__helpers__/renderWithProviders";

const testLesson = { id: 1, title: "Physics only review", slug: "lesson-slug" };
describe("pages/bookmarks.tsx", () => {
  it.skip("Renders 'loading' during fetch", async () => {
    renderWithProviders(<Home lesson={testLesson} />);

    expect(screen.getByText(/^Status:/).textContent).toBe("Status: loading");
  });
  it.skip("Renders lesson title after fetch", async () => {
    renderWithProviders(<Home lesson={testLesson} />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
        testLesson.title
      );
    });
  });
});
