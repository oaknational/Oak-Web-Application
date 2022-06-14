import { FC } from "react";

import { useUser } from "../context/Auth";
import Layout from "../components/Layout";
import Bookmarks from "../components/Bookmarks";
import { DEFAULT_SEO_PROPS } from "../browser-lib/seo/Seo";
import Grid from "../components/Grid";
import GridArea from "../components/Grid/GridArea";
import Card from "../components/Card";

const Home: FC = () => {
  const user = useUser();
  return (
    <Layout seoProps={DEFAULT_SEO_PROPS}>
      <Grid>
        <GridArea colSpan={[12, 12, 12]}>
          <h1 data-testid="home-page-title">Oak National Academy</h1>
        </GridArea>
        <GridArea colSpan={[12, 6, 6]}>
          <Card background={"grey2"}>Hello</Card>
        </GridArea>
        <GridArea colSpan={[12, 6, 6]}>
          <Card background={"calmAndWarm"}>Hello</Card>
        </GridArea>
      </Grid>
      {user && <Bookmarks />}
    </Layout>
  );
};

export default Home;
