import { act, fireEvent, waitFor } from "@testing-library/react";

import Bookmarks from "../../pages/bookmarks";
import { testLesson } from "../__helpers__/apolloMocks";
import renderWithProviders from "../__helpers__/renderWithProviders";

const testUser = { id: 123, email: "test email" };

describe("pages/bookmarks.tsx", () => {
  it("Renders the page title", async () => {
    const { getByRole } = renderWithProviders(<Bookmarks />);

    expect(getByRole("heading", { level: 1 }).textContent).toBe("Bookmarks");
  });
  it("Shows message if visitor is anonymous", () => {
    const { getByTestId } = renderWithProviders(<Bookmarks />);

    expect(getByTestId("anonymous-vistor-message")).toHaveTextContent(
      "bookmarks are only available for logged in users"
    );
  });
  it("Renders loading spinner during fetch", async () => {
    const { getByText } = renderWithProviders(<Bookmarks />, undefined, {
      authProviderProps: { value: { user: testUser } },
    });

    expect(getByText(/^Loading/).textContent).toBe("Loading");
  });
  it("Renders bookmarked lesson after fetch", async () => {
    const { getByTestId } = renderWithProviders(<Bookmarks />, undefined, {
      authProviderProps: { value: { user: testUser } },
    });

    await waitFor(() => {
      expect(getByTestId("bookmark-0").textContent).toBe(testLesson.title);
    });
  });
  it("Clicking 'remove' should remove the bookmark", async () => {
    const { getByRole, getByTestId } = renderWithProviders(
      <Bookmarks />,
      undefined,
      {
        authProviderProps: { value: { user: testUser } },
      }
    );

    let bookmarksList = await getByTestId("bookmarks-list");
    const originalLength = bookmarksList.childNodes.length;

    act(() => {
      const remove = getByRole("button", { name: /remove/i });
      fireEvent.click(remove);
    });

    await waitFor(() => {
      bookmarksList = getByTestId("bookmarks-list");
      const newLength = bookmarksList.childNodes.length;
      expect(newLength).toBe(originalLength - 1);
    });
  });
});
