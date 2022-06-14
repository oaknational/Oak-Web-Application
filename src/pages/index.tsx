import { FC } from "react";

import { useUser } from "../context/Auth";
import Layout from "../components/Layout";
import Bookmarks from "../components/Bookmarks";
import { DEFAULT_SEO_PROPS } from "../browser-lib/seo/Seo";
import Grid from "../components/Grid";
import GridArea from "../components/Grid/GridArea";
import Card from "../components/Card";
import { Heading } from "../components/Typography";

const Home: FC = () => {
  const user = useUser();
  return (
    <Layout seoProps={DEFAULT_SEO_PROPS} background={"grey1"}>
      <Grid cg={16} rg={[16, 24, 80]}>
        <GridArea colSpan={[12, 12, 8]}>
          <Heading fontSize={48} tag={"h1"} mt={64}>
            Oak National Academy
          </Heading>
        </GridArea>
        <GridArea colSpan={[12, 12, 4]}>
          <Card background={"white"} mt={48}>
            <Heading fontSize={20} tag={"h2"}>
              Use Oak in Beta
            </Heading>
          </Card>
        </GridArea>

        <GridArea colSpan={[12, 6, 6]}>
          <Card background={"white"}>Classroom</Card>
        </GridArea>
        <GridArea colSpan={[12, 6, 6]}>
          <Card background={"white"}>Teacherhub</Card>
        </GridArea>

        <GridArea colSpan={[12, 6, 3]}>
          <Card background={"white"}>Personalise</Card>
        </GridArea>
        <GridArea colSpan={[12, 6, 3]}>
          <Card background={"white"}>Curriculum</Card>
        </GridArea>
        <GridArea colSpan={[12, 6, 3]}>
          <Card background={"white"}>Lesson Planning</Card>
        </GridArea>
        <GridArea colSpan={[12, 6, 3]}>
          <Card background={"white"}>Oak for School</Card>
        </GridArea>
      </Grid>
      {user && <Bookmarks />}
    </Layout>
  );
};

export default Home;
