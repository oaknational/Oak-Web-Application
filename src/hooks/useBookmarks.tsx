import { createContext, FC, useCallback, useContext, useEffect } from "react";

import useAuth from "../auth/useAuth";
import {
  useBookmarkedLessonAddMutation,
  useBookmarkedLessonRemoveMutation,
  useBookmarkedLessonsLazyQuery,
} from "../browser-lib/graphql/generated/apollo";
import { LS_KEY_BOOKMARKS } from "../config/localStorageKeys";
import truthy from "../utils/truthy";

import useLocalStorage from "./useLocalStorage";

type Bookmark = {
  lesson: {
    id: number;
    slug: string;
    title: string;
  };
};

export const useBookmarksCache = () => {
  return useLocalStorage<Bookmark[]>(LS_KEY_BOOKMARKS, []);
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

  const [bookmarks, setBookmarks] = useBookmarksCache();
  const [addBookmarkMutation] = useBookmarkedLessonAddMutation();
  const [removeBookmarkMutation] = useBookmarkedLessonRemoveMutation();

  const [fetchBookmarks, { data, refetch, loading, error }] =
    useBookmarkedLessonsLazyQuery();

  useEffect(() => {
    if (user) {
      fetchBookmarks();
    }
  }, [user]);

  useEffect(() => {
    /**
     * @todo: we filter by truthy here. In future we will want to monitor this,
     * and likely action it. If a bookmark has a null lesson, it's likely that the lesson
     * is no longer available, or that there was an error connecting to the curriculum
     * data.
     *
     */
    if (data?.bookmarkedLessons) {
      console.log("setting bms ls", data.bookmarkedLessons);

      setBookmarks(
        data.bookmarkedLessons
          .map(({ lesson }) => lesson)
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
      const bookmark = res.data?.insert_bookmarkedLessons_one;
      if (!bookmark || !bookmark.lesson) {
        // @TODO bugsnag
        return;
      }
      const lesson = bookmark.lesson;
      setBookmarks((bookmarks) => [{ lesson }, ...bookmarks]);
      refetch();
    },
    [user, addBookmarkMutation]
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
    [user, removeBookmarkMutation]
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
