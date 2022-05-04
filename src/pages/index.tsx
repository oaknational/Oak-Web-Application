import { FC } from "react";

import Layout from "../components/Layout";
import useAuth from "../auth/useAuth";
import Bookmarks from "../components/Bookmarks";

const Home: FC = () => {
  const { isLoggedIn } = useAuth();
  return (
    <Layout>
      <h1 data-testid="lesson-title">Oak National Academy</h1>
      <p>Welcome to the Oak National Academy rebuild</p>
      {isLoggedIn && <Bookmarks />}
    </Layout>
  );
};

export default Home;
