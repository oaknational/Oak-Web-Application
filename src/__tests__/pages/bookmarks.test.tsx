import { waitFor } from "@testing-library/react";

import Bookmarks from "../../pages/bookmarks";
import { testLesson } from "../__helpers__/apolloMocks";
import renderWithProviders from "../__helpers__/renderWithProviders";

describe("pages/bookmarks.tsx", () => {
  it("Renders the page title", async () => {
    const { getByRole } = renderWithProviders(<Bookmarks />);

    expect(getByRole("heading", { level: 1 }).textContent).toBe("Bookmarks");
  });
  it("Renders loading spinner during fetch", async () => {
    const { getByText } = renderWithProviders(<Bookmarks />);

    expect(getByText(/^Loading/).textContent).toBe("Loading");
  });
  it("Renders bookmarked lesson after fetch", async () => {
    const { getByTestId } = renderWithProviders(<Bookmarks />);

    await waitFor(() => {
      expect(getByTestId("bookmark-0").textContent).toBe(testLesson.title);
    });
  });
});
