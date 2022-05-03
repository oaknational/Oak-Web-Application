import { act, fireEvent, waitFor } from "@testing-library/react";

import Bookmarks from "../../pages/bookmarks";
import { testLessons } from "../__helpers__/apolloMocks";
import renderWithProviders from "../__helpers__/renderWithProviders";

const testUser = { id: "123", email: "test email" };
const loggedInAuthProviderProps = {
  value: { user: testUser, isLoggedIn: true },
};

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
      authProviderProps: loggedInAuthProviderProps,
    });

    expect(getByText(/^Loading/).textContent).toBe("Loading");
  });
  it("Renders bookmarked lesson after fetch", async () => {
    const { getByTestId } = renderWithProviders(<Bookmarks />, undefined, {
      authProviderProps: loggedInAuthProviderProps,
    });

    await waitFor(() => {
      expect(getByTestId("bookmark-0").textContent).toBe(testLessons[0]?.title);
    });
  });
  it("Clicking 'remove' should remove the bookmark", async () => {
    const { getAllByRole, getByTestId } = renderWithProviders(
      <Bookmarks />,
      undefined,
      {
        authProviderProps: loggedInAuthProviderProps,
      }
    );

    let bookmarksList = await getByTestId("bookmarks-list");
    const originalLength = bookmarksList.childNodes.length;

    act(() => {
      const [firstRemoveButton] = getAllByRole("button", { name: /remove/i });
      if (!firstRemoveButton) {
        throw new Error("no 'remove bookmark' button not found");
      }
      fireEvent.click(firstRemoveButton);
    });

    await waitFor(() => {
      bookmarksList = getByTestId("bookmarks-list");
      const newLength = bookmarksList.childNodes.length;
      expect(newLength).toBe(originalLength - 1);
    });
  });
});
