import { FC } from "react";

import { useUser } from "../../context/Auth";
import { useBookmarks } from "../../context/Bookmarks";
import LoadingSpinner from "../LoadingSpinner";
import OakLink from "../OakLink";

const Bookmarks: FC = () => {
  const user = useUser();
  const { bookmarks, loading, error, removeBookmark } = useBookmarks();

  return (
    <>
      <header>
        <h1>Bookmarks</h1>
      </header>
      {!user ? (
        <p data-testid="anonymous-vistor-message">
          Currently bookmarks are only available for logged in users.{" "}
          <OakLink page={null} href="/beta/sign-in" $isInline>
            Sign in
          </OakLink>{" "}
          to start adding bookmarks!
        </p>
      ) : (
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
                  <OakLink
                    data-testid={`bookmark-${i}`}
                    page={null}
                    href={`/beta/lessons/${slug}`}
                  >
                    {lesson.title}
                  </OakLink>
                  <button onClick={() => removeBookmark(lesson.id)}>
                    remove
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </>
  );
};

export default Bookmarks;
