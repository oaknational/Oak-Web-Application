import { FC } from "react";

import { useUser } from "../../context/Auth";
import { LessonId } from "../../context/Bookmarks";
import useToggleBookmark from "../../context/Bookmarks/useToggleBookmark";
import IconButton from "../Button/IconButton";

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
      iconColorOverride={bookmarked ? "grey4" : undefined}
    />
  );
};

export default BookmarkLessonButton;
