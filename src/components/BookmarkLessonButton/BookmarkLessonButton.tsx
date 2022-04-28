import { FC, useState } from "react";

import useAuth from "../../auth/useAuth";
import useBookmarks, { LessonId } from "../../hooks/useBookmarks";
import IconButton from "../IconButton/IconButton";

type BookmarkLessonButtonProps = {
  lessonId: LessonId;
};
const BookmarkLessonButton: FC<BookmarkLessonButtonProps> = (props) => {
  const { lessonId } = props;
  const { user } = useAuth();
  const { bookmarks, addBookmark, removeBookmark, isBookmarked } =
    useBookmarks();
  const [loading, setLoading] = useState(typeof bookmarks === "undefined");

  if (!user) {
    // Bookmarks only for logged in
    return null;
  }

  const toggleBookmark = async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    try {
      if (!isBookmarked(lessonId)) {
        await addBookmark(lessonId);
      } else {
        await removeBookmark(lessonId);
      }
    } catch (error) {
      // @TODO: bugsnag
    } finally {
      setLoading(false);
    }
  };

  return (
    <IconButton
      onClick={toggleBookmark}
      icon="Star"
      aria-label={`${isBookmarked(lessonId) ? "Remove" : "Add"} Bookmark`}
      disabled={loading}
    />
  );
};

export default BookmarkLessonButton;
