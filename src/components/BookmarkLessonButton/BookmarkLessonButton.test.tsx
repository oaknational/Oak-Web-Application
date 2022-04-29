import { PropsWithChildren } from "react";
import userEvent from "@testing-library/user-event";

import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";
import { loggedInAuthProviderProps } from "../../__tests__/__helpers__/MockedAuthProvider";

import BookmarkLessonButton from ".";

const lessonId = "123";
const addBookmark = jest.fn();
const removeBookmark = jest.fn();
const isBookmarked = jest.fn();

jest.mock("../../hooks/useBookmarks.tsx", () => ({
  __esModule: true,
  default: () => ({
    bookmarks: [],
    addBookmark,
    removeBookmark,
    isBookmarked,
  }),
  BookmarksProvider: ({ children }: PropsWithChildren<null>) => children,
}));
describe("components/BookmarkLessonButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });
  it("if not logged, in should return null", () => {
    const { queryByRole } = renderWithProviders(
      <BookmarkLessonButton lessonId={lessonId} />
    );
    const button = queryByRole("button");
    expect(button).not.toBeInTheDocument();
  });
  it("if logged in, should be a button", () => {
    const { queryByRole } = renderWithProviders(
      <BookmarkLessonButton lessonId={lessonId} />,
      {},
      { authProviderProps: loggedInAuthProviderProps }
    );
    const button = queryByRole("button");
    expect(button).toBeInTheDocument();
  });
  it("if not bookmarked, should call 'addBookmark()' when clicked", async () => {
    isBookmarked.mockImplementation(() => false);
    const { getByRole } = renderWithProviders(
      <BookmarkLessonButton lessonId={lessonId} />,
      {},
      { authProviderProps: loggedInAuthProviderProps }
    );
    const user = userEvent.setup();
    const button = getByRole("button");
    await user.click(button);
    expect(addBookmark).toHaveBeenCalledWith(lessonId);
    expect(removeBookmark).not.toHaveBeenCalled();
  });
  it("if not bookmarked, should have a11y label 'Add bookmark'", async () => {
    isBookmarked.mockImplementation(() => false);
    const { getByRole } = renderWithProviders(
      <BookmarkLessonButton lessonId={lessonId} />,
      {},
      { authProviderProps: loggedInAuthProviderProps }
    );
    const button = getByRole("button");
    expect(button).toHaveAccessibleName("Add Bookmark");
  });
  it("if bookmarked, should call 'removeBookmark()' when clicked", async () => {
    isBookmarked.mockImplementation(() => true);
    const { getByRole } = renderWithProviders(
      <BookmarkLessonButton lessonId={lessonId} />,
      {},
      { authProviderProps: loggedInAuthProviderProps }
    );
    const user = userEvent.setup();
    const button = getByRole("button");
    await user.click(button);
    expect(removeBookmark).toHaveBeenCalledWith(lessonId);
    expect(addBookmark).not.toHaveBeenCalled();
  });
  it("if bookmarked, should have a11y label 'Remove bookmark'", async () => {
    isBookmarked.mockImplementation(() => true);
    const { getByRole } = renderWithProviders(
      <BookmarkLessonButton lessonId={lessonId} />,
      {},
      { authProviderProps: loggedInAuthProviderProps }
    );
    const button = getByRole("button");
    expect(button).toHaveAccessibleName("Remove Bookmark");
  });
});
