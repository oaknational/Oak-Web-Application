import { FC } from "react";

import { useUser } from "../context/Auth";
import Layout from "../components/Layout";
import Bookmarks from "../components/Bookmarks";

const Home: FC = () => {
  const user = useUser();
  return (
    <Layout>
      <h1 data-testid="home-page-title">Oak National Academy</h1>
      <p>Welcome to the Oak National Academy rebuild</p>
      {user && <Bookmarks />}
    </Layout>
  );
};

export default Home;
