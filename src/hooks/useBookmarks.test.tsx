import { FC, useState } from "react";
import { renderHook } from "@testing-library/react-hooks";
import { act } from "@testing-library/react";

import "../__tests__/__helpers__/LocalStorageMock";

import useBookmarks, { BookmarksProvider } from "./useBookmarks";

type LessonId = 1 | 2;
type Bookmark = {
  lesson: {
    id: LessonId;
    slug: string;
    title: string;
  };
};
type UserId = number;
type LessonUserTuple = { lessonId: LessonId; userId: UserId };

const bookmarkFixtures: Record<LessonId, Bookmark> = {
  1: {
    lesson: {
      id: 1,
      slug: "physics-only-review-chj3cd",
      title: "Physics only review",
    },
  },
  2: {
    lesson: {
      id: 2,
      slug: "macbeth-chj3cd",
      title: "Macbeth",
    },
  },
};
const getBookmarkFixture = ({ lessonId }: LessonUserTuple) => {
  return bookmarkFixtures[lessonId];
};

/**
 * BookmarksStore is used here so we can mock out apollo/bookmarks in a more meaningful way
 * i.e. one that keeps a record updates the store when a record is added/removed.
 * We use it, and mock the apollo hooks instead of using the MockedAppoloProvider, which
 * is a very naive implementation which always returns the same values and stores no state.
 */
class BookmarksStore {
  store: Record<string, Bookmark> = {};

  clear() {
    this.store = {};
  }

  replaceStore(store: Record<string, Bookmark>) {
    this.store = store;
  }

  getAll() {
    return Object.values(this.store);
  }

  getBookmark(key: LessonId) {
    return this.store[key] || null;
  }

  addBookmark(value: LessonUserTuple) {
    this.store[value.lessonId] = getBookmarkFixture(value);
  }

  removeBookmark(key: LessonId) {
    delete this.store[key];
  }
}
const bookmarksStore = new BookmarksStore();

const useBookmarkedLessonRemoveMutation = () => {
  return [
    ({ variables }: { variables: LessonUserTuple }) => {
      bookmarksStore.removeBookmark(variables.lessonId);
    },
  ];
};
const useBookmarkedLessonAddMutation = () => {
  return [
    ({ variables }: { variables: LessonUserTuple }) => {
      bookmarksStore.addBookmark(variables);
      return {
        data: {
          insert_bookmarked_lesson_one: getBookmarkFixture(variables),
        },
      };
    },
  ];
};

const fetchBookmarks = jest.fn();

const useBookmarkedLessonsLazyQuery = () => {
  const [loading] = useState(false);
  const [data, setData] = useState(bookmarksStore.getAll());
  fetchBookmarks.mockImplementation(() => setData(bookmarksStore.getAll()));

  return [
    fetchBookmarks,
    { data, refetch: fetchBookmarks, loading, error: "" },
  ];
};

const Providers: FC = ({ children }) => {
  return <BookmarksProvider>{children}</BookmarksProvider>;
};

const testUser = { id: 123, email: "test email" };
const useAuth = jest.fn<{ user: typeof testUser | null }, []>(() => ({
  user: testUser,
}));
jest.mock("../auth/useAuth", () => ({
  __esModule: true,
  default: (...args: []) => useAuth(...args),
}));

jest.mock("../browser-lib/graphql/generated/apollo", () => ({
  useBookmarkedLessonAddMutation: (...args: []) =>
    useBookmarkedLessonAddMutation(...args),
  useBookmarkedLessonRemoveMutation: (...args: []) =>
    useBookmarkedLessonRemoveMutation(...args),
  useBookmarkedLessonsLazyQuery: (...args: []) =>
    useBookmarkedLessonsLazyQuery(...args),
}));
describe("hooks/useBookmarks.tsx", () => {
  beforeEach(() => {
    window.localStorage.clear();
    bookmarksStore.clear();
    jest.clearAllMocks();
    jest.resetModules();
  });
  it("should default bookmarks to empty array", () => {
    const { result } = renderHook(useBookmarks, { wrapper: Providers });
    const { bookmarks } = result.current;
    expect(bookmarks).toEqual([]);
  });
  it("should be able to add a bookmark", async () => {
    const { result } = renderHook(useBookmarks, { wrapper: Providers });

    const lessonId = 1;
    await act(async () => {
      await result.current.addBookmark(lessonId);
    });
    expect(result.current.bookmarks).toEqual([bookmarkFixtures[lessonId]]);
  });
  it("should be able to remove a bookmark", async () => {
    const { result } = renderHook(useBookmarks, { wrapper: Providers });

    // Add some bookmarks
    await act(async () => {
      await result.current.addBookmark(2);
      await result.current.addBookmark(1);
    });
    expect(result.current.bookmarks).toHaveLength(2);

    // Attempt remove a bookmark
    await act(async () => {
      await result.current.removeBookmark(1);
    });

    expect(result.current.bookmarks).toContainEqual(bookmarkFixtures[2]);
  });
  it("should expose a working isBookmarked function", async () => {
    const { result } = renderHook(useBookmarks, { wrapper: Providers });

    // Add some bookmarks
    await act(async () => {
      await result.current.addBookmark(1);
    });
    expect(result.current.bookmarks).toHaveLength(1);

    expect(result.current.isBookmarked(1)).toEqual(true);
    expect(result.current.isBookmarked(2)).toEqual(false);
  });
  it("should fetch bookmarks on load if visitor is logged in", async () => {
    await renderHook(useBookmarks, { wrapper: Providers });

    expect(fetchBookmarks).toHaveBeenCalled();
  });
  it("should not fetch bookmarks on load if visitor is anonymous", async () => {
    useAuth.mockImplementationOnce(() => ({ user: null }));

    await renderHook(useBookmarks, { wrapper: Providers });

    expect(fetchBookmarks).not.toHaveBeenCalled();
  });
});
