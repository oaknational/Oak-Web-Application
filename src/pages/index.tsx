import { FC } from "react";

import { useUser } from "../context/Auth";
import LandingPageLayout from "../components/Layout/LandingPageLayout";
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
import CardAsLink from "../components/Card/CardAsLink";
import Icon from "../components/Icon";

const items: BlogListProps["items"] = [
  {
    titleTag: "h3",
    title: "Webinar about school",
    snippet:
      "Preview, plan and customise each element of your work to meet your needs - in and out the classroom.",
    href: "/",
    contentType: "webinar",
  },
  {
    titleTag: "h3",
    title: "Blog about learning",
    snippet:
      "Preview, plan and customise each element of your work to meet your needs - in and out the classroom.",
    href: "/",
    contentType: "blog-post",
  },
  {
    titleTag: "h3",
    title: "Webinar from a maths teacher",
    snippet:
      "Preview, plan and customise each element of your work to meet your needs - in and out the classroom.",
    href: "/",
    contentType: "webinar",
  },
  {
    titleTag: "h3",
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
    <LandingPageLayout seoProps={DEFAULT_SEO_PROPS} background={"grey1"}>
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
          <CardAsLink
            background={"white"}
            href="https://classroom.thenational.academy/"
          >
            <Flex
              flexDirection={"column"}
              justifyContent={"center"}
              alignItems="center"
            >
              <Icon name={"GraduationCap"} size={64} />
              <Heading mt={24} mb={0} fontSize={24} tag={"h5"} color={"grey8"}>
                Classroom
              </Heading>
            </Flex>
          </CardAsLink>
        </GridArea>
        <GridArea colSpan={[12, 12, 6]}>
          <CardAsLink
            background={"white"}
            href="https://teachers.thenational.academy/"
          >
            <Flex
              flexDirection={"column"}
              justifyContent={"center"}
              alignItems="center"
            >
              <Icon name={"University"} size={64} />
              <Heading mt={24} mb={0} fontSize={24} tag={"h5"} color={"grey8"}>
                Teacher Hub
              </Heading>
            </Flex>
          </CardAsLink>
        </GridArea>

        <GridArea colSpan={[12, 4, 4]}>
          <CardAsLink background={"white"} href="/">
            <Flex
              flexDirection={"column"}
              justifyContent={"center"}
              alignItems="center"
            >
              <Icon name={"University"} size={64} />
              <Heading mt={24} mb={0} fontSize={24} tag={"h5"} color={"grey8"}>
                Curriculum
              </Heading>
            </Flex>
          </CardAsLink>
        </GridArea>
        <GridArea colSpan={[12, 4, 4]}>
          <CardAsLink background={"white"} href="/">
            <Flex
              flexDirection={"column"}
              justifyContent={"center"}
              alignItems="center"
            >
              <Icon name={"University"} size={64} />
              <Heading mt={24} mb={0} fontSize={24} tag={"h5"} color={"grey8"}>
                Lesson Planning
              </Heading>
            </Flex>
          </CardAsLink>
        </GridArea>
        <GridArea colSpan={[12, 4, 4]}>
          <CardAsLink background={"white"} href="/">
            <Flex
              flexDirection={"column"}
              justifyContent={"center"}
              alignItems="center"
            >
              <Icon name={"GraduationCap"} size={64} />
              <Heading mt={24} mb={0} fontSize={24} tag={"h5"} color={"grey8"}>
                Oak for Schools
              </Heading>
            </Flex>
          </CardAsLink>
        </GridArea>
      </Grid>

      <Grid cg={16} rg={[16]} mt={[16, 48, 80]}>
        <GridArea colSpan={[12, 6, 4]} order={[0, 0, 0]}>
          <Card background="white">
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
            <ButtonAsLink
              mt={"auto"}
              fullWidth
              href="/"
              label="Find out more"
            />
          </Card>
        </GridArea>

        <GridArea colSpan={[12, 12, 8]} rowSpan={2} order={[3, 1, 0]}>
          <Flex background={"white"} pa={24}>
            <BlogList
              title={"Stay up to date!"}
              items={items}
              titleTag={"h2"}
            />
          </Flex>
        </GridArea>

        <GridArea colSpan={[12, 6, 4]} order={[2, 0, 0]}>
          <Card background="white">
            <CardTitle
              icon="Home"
              iconPosition="leading"
              iconSize={34}
              tag="h2"
              title="Need some help?"
            />
            <P fontSize={16} mb={24}>
              Preview, plan and customise each element of our lessons to meet
              your needs - whether inside and outside the classroom.
            </P>
            <ButtonAsLink
              mt={"auto"}
              fullWidth
              href="/"
              label="Visit Help Center"
            />
          </Card>
        </GridArea>
      </Grid>
      {user && <Bookmarks />}
    </LandingPageLayout>
  );
};

export default Home;
