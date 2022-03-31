import { FC, useState } from "react";

import useAuth from "../../auth/useAuth";
import useBookmarks from "../../hooks/useBookmarks";
import Button from "../Button";

type BookmarkLessonButtonProps = {
  lessonId: number;
};
const BookmarkLessonButton: FC<BookmarkLessonButtonProps> = (props) => {
  const { lessonId } = props;
  const [error, setError] = useState<string>();
  // @TODO this button should only show for users?
  const { user } = useAuth();
  const { bookmarks, addBookmark, removeBookmark, isBookmarked } =
    useBookmarks();
  const [loading, setLoading] = useState(typeof bookmarks === "undefined");

  // console.log({
  //   lessonId,
  //   bookmarks,
  //   isBookmarked,
  //   loading,
  // });

  // if (!user) {
  //   // Bookmarks only for logged in users?
  //   return null;
  // }

  const toggleBookmark = async () => {
    if (loading) {
      return;
    }
    if (!user) {
      // @TODO error user must be signed in
      return;
    }
    setLoading(true);
    console.log("adding");
    try {
      if (!isBookmarked(lessonId)) {
        await addBookmark(lessonId);
      } else {
        await removeBookmark(lessonId);
      }
    } catch (error) {
      // @TODO: bugsnag
      setError("Failed");
    } finally {
      setLoading(false);
    }
  };

  console.log("button render");

  return (
    <Button
      onClick={toggleBookmark}
      icon="Star"
      label={`${isBookmarked(lessonId) ? "Remove" : "Add"} Bookmark`}
      disabled={loading}
    />
  );
};

export default BookmarkLessonButton;
