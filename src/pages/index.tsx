import { FC } from "react";

import { useUser } from "../context/Auth";
import Layout from "../components/Layout";
import Bookmarks from "../components/Bookmarks";
import { DEFAULT_SEO_PROPS } from "../browser-lib/seo/Seo";
import Grid from "../components/Grid";
import GridArea from "../components/Grid/GridArea";
import Card from "../components/Card";
import { Heading, P } from "../components/Typography";
import BlogList, { BlogListProps } from "../components/BlogList/BlogList";
import Flex from "../components/Flex";
import CardTitle from "../components/Card/CardComponents/CardTitle";
import ButtonAsLink from "../components/Button/ButtonAsLink";

const items: BlogListProps["items"] = [
  {
    titleTag: "h2",
    title: "Webinar about school",
    snippet:
      "Preview, plan and customise each element of your work to meet your needs - in and out the classroom.",
    href: "/",
    contentType: "webinar",
  },
  {
    titleTag: "h2",
    title: "Blog about learning",
    snippet:
      "Preview, plan and customise each element of your work to meet your needs - in and out the classroom.",
    href: "/",
    contentType: "blog-post",
  },
  {
    titleTag: "h2",
    title: "Webinar from a maths teacher",
    snippet:
      "Preview, plan and customise each element of your work to meet your needs - in and out the classroom.",
    href: "/",
    contentType: "webinar",
  },
  {
    titleTag: "h2",
    title: "Blog post about making lunch break all day",
    snippet:
      "Preview, plan and customise each element of your work to meet your needs - in and out the classroom.",
    href: "/",
    contentType: "webinar",
  },
];

const Home: FC = () => {
  const user = useUser();
  return (
    <Layout seoProps={DEFAULT_SEO_PROPS} background={"grey1"}>
      <Grid cg={16} rg={[16, 48, 80]}>
        <GridArea colSpan={[12, 12, 8]}>
          <Heading
            fontSize={48}
            tag={"h1"}
            mt={64}
            data-testid="home-page-title"
          >
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

        <GridArea colSpan={[12, 12, 6]}>
          <Card background={"white"}>Classroom</Card>
        </GridArea>
        <GridArea colSpan={[12, 12, 6]}>
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

        <GridArea colSpan={[12, 12, 4]}>
          <Card mb={[0, 0, 16]} background="white">
            <CardTitle
              icon="Home"
              iconPosition="leading"
              iconSize={34}
              tag="h2"
              title="About Oak Academy"
            />
            <P fontSize={16} mb={24}>
              Preview, plan and customise each element of our lessons to meet
              your needs -
            </P>
            <ButtonAsLink fullWidth href="/" label="Find out more" />
          </Card>

          <Card background="white">
            <CardTitle
              icon="Home"
              iconPosition="leading"
              iconSize={34}
              tag="h4"
              title="Need some help?"
            />
            <P fontSize={16} mb={24}>
              Preview, plan and customise each element of our lessons to meet
              your needs - whether inside and outside the classroom.
            </P>
            <ButtonAsLink fullWidth href="/" label="Visit Help Center" />
          </Card>
        </GridArea>

        <GridArea colSpan={[4, 12, 8]}>
          <Flex background={"white"} pa={24}>
            <BlogList
              title={"Stay up to date!"}
              items={items}
              titleTag={"h2"}
            />
          </Flex>
        </GridArea>
      </Grid>
      {user && <Bookmarks />}
    </Layout>
  );
};

export default Home;
