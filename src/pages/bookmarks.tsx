import { NextPage } from "next";
import Link from "next/link";

import { useUser } from "../context/Auth";
import Bookmarks from "../components/Bookmarks";
import Layout from "../components/Layout";

const BookmarksPage: NextPage = () => {
  const user = useUser();
  return (
    <Layout>
      <header>
        <h1>Bookmarks</h1>
      </header>
      {!user ? (
        <p data-testid="anonymous-vistor-message">
          Currently bookmarks are only available for logged in users.{" "}
          <Link href="/sign-in">Sign in</Link> to start adding bookmarks!
        </p>
      ) : (
        <Bookmarks />
      )}
    </Layout>
  );
};

export default BookmarksPage;
