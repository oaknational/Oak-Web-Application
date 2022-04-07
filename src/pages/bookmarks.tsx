import { NextPage } from "next";
import Link from "next/link";

import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import useBookmarks from "../hooks/useBookmarks";

const BookmarksPage: NextPage = () => {
  const { bookmarks, loading, error, removeBookmark } = useBookmarks();

  console.log({ loading, error, bookmarks });

  return (
    <Layout>
      <header>
        <h1>Bookmarks</h1>
        {loading && <LoadingSpinner />}
      </header>
      <p>Here are all your bookmarked lessons</p>

      {error && <p color="red">{error}</p>}
      <ul>
        {bookmarks?.map(({ lesson }, i) => {
          if (!lesson) {
            return null;
          }
          const { slug } = lesson;
          return (
            <li key={slug}>
              <Link href={`/lessons/${slug}`}>
                <a data-testid={`bookmark-${i}`}>{lesson.title}</a>
              </Link>
              <button onClick={() => removeBookmark(lesson.id)}>remove</button>
            </li>
          );
        })}
      </ul>
    </Layout>
  );
};

export default BookmarksPage;
