import useBookmarks, { LessonId } from "./useBookmarks";

type UseToggleBookmarkProps = {
  lessonId: LessonId;
};
const useToggleBookmark = (props: UseToggleBookmarkProps) => {
  const { lessonId } = props;
  const { addBookmark, removeBookmark, isBookmarked, loading } = useBookmarks();
  // const [loading, setLoading] = useState(typeof bookmarks === "undefined");

  const toggleBookmark = async () => {
    if (loading) {
      return;
    }

    // setLoading(true);
    try {
      if (!isBookmarked(lessonId)) {
        await addBookmark(lessonId);
      } else {
        await removeBookmark(lessonId);
      }
    } catch (error) {
      // @TODO: bugsnag
    } finally {
      // setLoading(false);
    }
  };

  return {
    toggleBookmark,
    loading,
    bookmarked: isBookmarked(lessonId),
  };
};

export default useToggleBookmark;
