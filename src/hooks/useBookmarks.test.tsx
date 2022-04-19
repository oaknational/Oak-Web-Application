import { FC } from "react";
import { renderHook } from "@testing-library/react-hooks";
import { act } from "@testing-library/react";

import MockedApolloProvider from "../__tests__/__helpers__/MockedApolloProvider";
import { testBookmark } from "../__tests__/__helpers__/apolloMocks";

import useBookmarks, { BookmarksProvider } from "./useBookmarks";

class LocalStorageMock {
  store: Record<string, unknown> = {};

  clear() {
    this.store = {};
  }

  getItem(key: string) {
    return this.store[key] || null;
  }

  setItem(key: string, value: unknown) {
    this.store[key] = value + "";
  }

  removeItem(key: string) {
    delete this.store[key];
  }
}

Object.defineProperty(window, "localStorage", {
  value: new LocalStorageMock(),
});

const Providers: FC = ({ children }) => {
  return (
    <MockedApolloProvider>
      <BookmarksProvider>{children}</BookmarksProvider>
    </MockedApolloProvider>
  );
};

const testUser = { id: 123, email: "test email" };
jest.mock("../auth/useAuth", () => ({
  __esModule: true,
  default: jest.fn(() => ({ user: testUser })),
}));

describe("hooks/useBookmarks.tsx", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });
  it("should default bookmarks to empty array", () => {
    const { result } = renderHook(useBookmarks, {
      wrapper: Providers,
    });
    const { bookmarks } = result.current;
    expect(bookmarks).toEqual([]);
  });
  it("should be able to add a bookmark", async () => {
    const { result } = renderHook(useBookmarks, {
      wrapper: Providers,
    });
    const lessonId = 1;

    await act(async () => {
      await result.current.addBookmark(lessonId);
    });
    console.log(result.current);
    const { created_at, ...bookmark } = testBookmark;

    expect(result.current.bookmarks).toEqual([bookmark]);
  });
  it.todo("should be able to remove a bookmark");
  it.todo("should expose a working isBookmarked functioned");
  it.todo("should not fetch bookmarks if visitor is anonymous");
});
