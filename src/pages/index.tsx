import { FC } from "react";

import Layout from "../components/Layout";
import useAuth from "../auth/useAuth";
import Bookmarks from "../components/Bookmarks";
import { DEFAULT_SEO_PROPS } from "../browser-lib/seo/Seo";

const Home: FC = () => {
  const { isLoggedIn } = useAuth();
  return (
    <Layout seoProps={DEFAULT_SEO_PROPS}>
      <h1 data-testid="home-page-title">Oak National Academy</h1>
      <p>Welcome to the Oak National Academy rebuild</p>
      {isLoggedIn && <Bookmarks />}
    </Layout>
  );
};

export default Home;
