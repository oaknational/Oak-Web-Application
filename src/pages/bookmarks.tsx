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
      <h1>
        Bookmarks
        {loading && <LoadingSpinner />}
      </h1>
      <p>Here are all your bookmarked lessons</p>

      {error && <p color="red">{error}</p>}
      <ul>
        {bookmarks?.map(({ lesson }) => {
          if (!lesson) {
            return null;
          }
          const { slug } = lesson;
          return (
            <li key={slug}>
              <Link href={`/lessons/${slug}`}>{lesson.title}</Link>
              <button onClick={() => removeBookmark(lesson.id)}>remove</button>
            </li>
          );
        })}
      </ul>
    </Layout>
  );
};

export default BookmarksPage;
