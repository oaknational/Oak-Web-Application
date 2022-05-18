import { createContext } from "react";

/**
 * @todo LessonId should be live with Lesson related code
 */
export type LessonId = string;
export type Bookmark = {
  lesson: {
    id: LessonId;
    slug: string;
    title: string;
  };
};

export type BookmarksContext = {
  bookmarks: Bookmark[];
  loading: boolean;
  error: string | null;
  addBookmark: (lessonId: LessonId) => Promise<void>;
  removeBookmark: (lessonId: LessonId) => Promise<void>;
  refetchBookmarks: () => Promise<void>;
  isBookmarked: (lessonId: LessonId) => boolean;
};
const bookmarksContext = createContext<BookmarksContext | null>(null);

export default bookmarksContext;
