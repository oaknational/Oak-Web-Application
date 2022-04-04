import { createContext, FC, useCallback, useContext, useEffect } from "react";

import useAuth from "../auth/useAuth";
import {
  useBookmarkedLessonAddMutation,
  useBookmarkedLessonRemoveMutation,
  useBookmarkedLessonsQuery,
} from "../data-layer/graphql/generated/apollo";
import truthy from "../utils/truthy";

import useLocalStorage from "./useLocalStorage";

type Bookmark = {
  lesson: {
    id: number;
    slug: string;
    title: string;
  };
};
export type BookmarksContext = {
  bookmarks: Bookmark[];
  loading: boolean;
  error: string | null;
  addBookmark: (lessonId: number) => Promise<void>;
  removeBookmark: (lessonId: number) => Promise<void>;
  refetchBookmarks: () => Promise<void>;
  isBookmarked: (lessonId: number) => boolean;
};
const bookmarksContext = createContext<BookmarksContext | null>(null);

/**
 *
 * BookmarksProvider is to be used for any lesson bookmark activity in the app.
 * Note: since bookmarks are added to state locally rather than refetching (which
 * is slower and more requests), it's important to note that sort order is
 * important. Currently in the query it is set to order_by: { created_at: desc },
 * meaning latest first.
 */
export const BookmarksProvider: FC = ({ children }) => {
  const { user } = useAuth();
  /**
   * @TODO do we want to have this as null for when initial bookmarks not yet loaded?
   * Do we want to store bookmarks in local-storage for cache? Or let apollo handle
   * a local storage cache?
   */
  const [bookmarks, setBookmarks] = useLocalStorage<Bookmark[]>(
    "bookmarks",
    []
  );

  const [addBookmarkMutation] = useBookmarkedLessonAddMutation();
  const [removeBookmarkMutation] = useBookmarkedLessonRemoveMutation();

  const { data, refetch, loading, error } = useBookmarkedLessonsQuery();

  useEffect(() => {
    console.log("bookmarm data changed");

    if (data?.bookmarked_lesson) {
      setBookmarks(
        data?.bookmarked_lesson
          ?.map(({ lesson }) => lesson)
          .filter(truthy)
          .map((lesson) => ({ lesson }))
      );
    }
  }, [data]);

  const addBookmark = useCallback(
    async (lessonId: number) => {
      if (!user) {
        // @TODO bugsnag
        return console.warn("Add bookmark called without user in scope");
      }
      const res = await addBookmarkMutation({ variables: { lessonId } });
      const bookmark = res.data?.insert_bookmarked_lesson_one;
      if (!bookmark || !bookmark.lesson) {
        // @TODO bugsnag
        return;
      }
      const lesson = bookmark.lesson;
      setBookmarks((bookmarks) => [{ lesson }, ...bookmarks]);
      refetch();
    },
    [user]
  );

  const removeBookmark = useCallback(
    async (lessonId: number) => {
      if (!user) {
        // @TODO bugsnag
        return console.warn("Remove bookmark called without user in scope");
      }
      await removeBookmarkMutation({
        variables: { lessonId, userId: user.id },
      });
      // Question do we want to optimistically remove these?
      setBookmarks((bookmarks) =>
        bookmarks.filter((bookmark) => bookmark.lesson.id !== lessonId)
      );
      refetch();
    },
    [user]
  );

  const refetchBookmarks = async () => {
    await refetch();
  };

  const isBookmarked = useCallback(
    (lessonId: number) => {
      return bookmarks.some((bookmark) => bookmark.lesson.id === lessonId);
    },
    [bookmarks]
  );

  const value: BookmarksContext = {
    bookmarks,
    loading,
    error: error ? "Sorry, we could not load your bookmarks" : null,
    addBookmark,
    removeBookmark,
    refetchBookmarks,
    isBookmarked,
  };
  return (
    <bookmarksContext.Provider value={value}>
      {children}
    </bookmarksContext.Provider>
  );
};

const useBookmarks = () => {
  const bookmarksContextValue = useContext(bookmarksContext);
  if (!bookmarksContextValue) {
    throw new Error("useBookmarks called outside of BookmarksProvider");
  }
  return bookmarksContextValue;
};

export default useBookmarks;
