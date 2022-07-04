import Link from "next/link";
import { FC } from "react";

import { useBookmarks } from "../../context/Bookmarks";
import LoadingSpinner from "../LoadingSpinner";

const Bookmarks: FC = () => {
  const { bookmarks, loading, error, removeBookmark } = useBookmarks();

  return (
    <>
      <p>
        {bookmarks.length > 0 && "Here are all your bookmarked lessons"}
        {bookmarks.length === 0 &&
          "Looks like you haven't bookmarked any lessons yet!"}
        {loading && <LoadingSpinner />}
      </p>
      {error && <p color="red">{error}</p>}
      <ul data-testid="bookmarks-list">
        {bookmarks?.map(({ lesson }, i) => {
          if (!lesson) {
            return null;
          }
          const { slug } = lesson;
          return (
            <li key={slug}>
              <Link href={`beta/lessons/${slug}`}>
                <a data-testid={`bookmark-${i}`}>{lesson.title}</a>
              </Link>
              <button onClick={() => removeBookmark(lesson.id)}>remove</button>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default Bookmarks;
