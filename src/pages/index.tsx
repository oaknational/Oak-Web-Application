import { FC } from "react";

import { useUser } from "../context/Auth";
import Layout from "../components/Layout";
import Bookmarks from "../components/Bookmarks";
import { DEFAULT_SEO_PROPS } from "../browser-lib/seo/Seo";
import BrowserWidthBar from "../components/BrowserWidthBar";

const Home: FC = () => {
  const user = useUser();
  return (
    <Layout seoProps={DEFAULT_SEO_PROPS}>
      <BrowserWidthBar background="white" pv={40} flexDirection="column">
        <h1 data-testid="home-page-title">Oak National Academy</h1>
        <p>Welcome to the Oak National Academy rebuild</p>
      </BrowserWidthBar>
      {user && <Bookmarks />}
    </Layout>
  );
};

export default Home;
