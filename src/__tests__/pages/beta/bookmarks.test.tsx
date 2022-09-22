import { act, fireEvent } from "@testing-library/react";

import BookmarksPage from "../../../pages/beta/bookmarks";
import { testBookmarks, testLessons } from "../../__helpers__/apolloMocks";
import renderWithProviders from "../../__helpers__/renderWithProviders";

const testUser = { id: "123", email: "test email" };
const loggedInAuthProviderValue = {
  user: testUser,
};

const removeBookmark = jest.fn();
const useBookmarks = () => ({
  bookmarks: testBookmarks,
  loading: true,
  removeBookmark: (...args: []) => removeBookmark(...args),
});
jest.mock("../../../context/Bookmarks/useBookmarks", () => ({
  __esModule: true,
  // eslint-disable-next-line react-hooks/rules-of-hooks
  default: (...args: []) => useBookmarks(...args),
}));

describe("pages/beta/bookmarks.tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });
  it("Renders the page title", () => {
    const { getByRole } = renderWithProviders(<BookmarksPage />);

    expect(getByRole("heading", { level: 1 }).textContent).toBe("Bookmarks");
  });
  it("Shows message if visitor is anonymous", () => {
    const { getByTestId } = renderWithProviders(<BookmarksPage />);

    expect(getByTestId("anonymous-vistor-message")).toHaveTextContent(
      "bookmarks are only available for logged in users"
    );
  });
  it("Renders loading spinner during fetch", () => {
    const { getByText } = renderWithProviders(
      <BookmarksPage
        __testAppLayoutProps={{ authProviderValue: loggedInAuthProviderValue }}
      />
    );

    expect(getByText(/^Loading/).textContent).toBe("Loading");
  });
  it("Renders bookmarked lesson after fetch", () => {
    const { getByTestId } = renderWithProviders(
      <BookmarksPage
        __testAppLayoutProps={{ authProviderValue: loggedInAuthProviderValue }}
      />
    );

    expect(getByTestId("bookmark-0").textContent).toBe(testLessons[0]?.title);
  });
  it("Clicking 'remove' should call 'removeBookmark()' with correct lessonId", () => {
    const { getAllByRole } = renderWithProviders(
      <BookmarksPage
        __testAppLayoutProps={{
          authProviderValue: loggedInAuthProviderValue,
        }}
      />
    );

    const firstLessonId = testLessons[0]?.id;
    act(() => {
      const [firstRemoveButton] = getAllByRole("button", { name: /remove/i });
      if (!firstRemoveButton) {
        throw new Error("no 'remove bookmark' button not found");
      }
      fireEvent.click(firstRemoveButton);
    });

    expect(removeBookmark).toHaveBeenCalledWith(firstLessonId);
  });
});
