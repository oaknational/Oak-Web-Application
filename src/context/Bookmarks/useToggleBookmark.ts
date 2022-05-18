import { useBookmarks, LessonId } from ".";

type UseToggleBookmarkProps = {
  lessonId: LessonId;
};
const useToggleBookmark = (props: UseToggleBookmarkProps) => {
  const { lessonId } = props;
  const { addBookmark, removeBookmark, isBookmarked, loading } = useBookmarks();

  const toggleBookmark = async () => {
    if (loading) {
      return;
    }

    try {
      if (!isBookmarked(lessonId)) {
        await addBookmark(lessonId);
      } else {
        await removeBookmark(lessonId);
      }
    } catch (error) {
      // @TODO: bugsnag
    }
  };

  return {
    toggleBookmark,
    loading,
    bookmarked: isBookmarked(lessonId),
  };
};

export default useToggleBookmark;
