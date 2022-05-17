import { FC } from "react";

import { useUser } from "../../context/Auth";
import { LessonId } from "../../hooks/useBookmarks";
import useToggleBookmark from "../../hooks/useToggleBookmark";
import IconButton from "../IconButton/IconButton";

type BookmarkLessonButtonProps = {
  lessonId: LessonId;
};
const BookmarkLessonButton: FC<BookmarkLessonButtonProps> = (props) => {
  const { lessonId } = props;
  const user = useUser();

  const { toggleBookmark, bookmarked, loading } = useToggleBookmark({
    lessonId,
  });

  if (!user) {
    // Bookmarks only for logged in
    return null;
  }

  return (
    <IconButton
      onClick={toggleBookmark}
      icon="Star"
      aria-label={`${bookmarked ? "Remove" : "Add"} Bookmark`}
      disabled={loading}
      iconColorOverride={bookmarked ? "color-icon-bookmarked" : undefined}
    />
  );
};

export default BookmarkLessonButton;
