import { GetStaticProps, GetStaticPropsResult, NextPage } from "next";
import { toPlainText } from "@portabletext/react";

import CMSClient from "../node-lib/cms";
import { HomePage } from "../common-lib/cms-types";
import { getSeoProps } from "../browser-lib/seo/getSeoProps";
import Grid from "../components/Grid";
import GridArea from "../components/Grid/GridArea";
import Card from "../components/Card";
import { Heading } from "../components/Typography";
import CardLink from "../components/Card/CardLink";
import MaxWidth from "../components/MaxWidth/MaxWidth";
import Box from "../components/Box";
import Layout from "../components/Layout";
import Flex from "../components/Flex";
import Svg from "../components/Svg";
import useAnalytics from "../context/Analytics/useAnalytics";
import { PostListItemProps } from "../components/Posts/PostList/PostListItem";
import {
  blogToPostListItem,
  SerializedBlogPostPreview,
} from "../components/pages/BlogIndex.page";
import {
  SerializedWebinarPreview,
  webinarToPostListItem,
} from "../components/pages/WebinarsIndex.page";
import { serializeDate } from "../utils/serializeDate";
import usePostList from "../components/Posts/PostList/usePostList";
import { HomeSiteCards, SharedHomeContent } from "../components/pages/Home";
import Illustration from "../components/Illustration";
import { getSizes } from "../components/CMSImage/getSizes";
import HomeNotification from "../components/pages/Home/HomeNotification";
import getPageProps from "../node-lib/getPageProps";

export type SerializedPost =
  | ({ type: "blog-post" } & SerializedBlogPostPreview)
  | ({ type: "webinar" } & SerializedWebinarPreview);

export type HomePageProps = {
  pageData: HomePage;
  posts: SerializedPost[];
};

const Home: NextPage<HomePageProps> = (props) => {
  const { track } = useAnalytics();
  const posts = props.posts.map(postToPostListItem);
  const blogListProps = usePostList({ items: posts, withImage: true });

  return (
    <Layout
      seoProps={getSeoProps(props.pageData.seo, { addTitleSuffix: false })}
    >
      <Flex $flexDirection={"column"} $position="relative">
        <Flex $justifyContent={"center"} $background={"pupilsLightGreen"}>
          <MaxWidth $ph={[0, 12]}>
            <Flex
              $width={"100%"}
              $pt={[40, 32]}
              $pb={[32, 40]}
              $flexDirection={["column", "row"]}
              $ph={[12, 0]}
            >
              <Flex
                $mr="auto"
                $pr={[0, 16]}
                $pb={[32, 0]}
                $flexDirection={"column"}
                $justifyContent="center"
              >
                <Heading
                  $font={["heading-5", "heading-4"]}
                  tag={"h1"}
                  $mb={8}
                  data-testid="home-page-title"
                  $color={"black"}
                >
                  {props.pageData.heading}
                </Heading>
                <Heading
                  tag={"h2"}
                  $font={["heading-light-7", "heading-light-6"]}
                >
                  {/* @TODO: The portable text in the CMS allows more features
                             than just plain text. We should decide if we want
                             to lock that down, or handle more cases here */}
                  {toPlainText(props.pageData.summaryPortableText)}
                </Heading>
              </Flex>
              {props.pageData.notification?.enabled && (
                <Box $ph={[16, 0]}>
                  <HomeNotification
                    notification={props.pageData.notification}
                  />
                </Box>
              )}
            </Flex>
            <Grid $cg={[8, 16]}>
              <GridArea $colSpan={[6, 6]}>
                <Card
                  $background="white"
                  $justifyContent="center"
                  $alignItems="center"
                  $borderRadius={4}
                  $pa={0}
                  $pt={[16, 92]}
                  $pb={[120, 92]}
                  $pr={[null, 56]}
                >
                  <Box
                    $position="absolute"
                    $top={0}
                    $bottom={0}
                    $left={0}
                    $right={[0, "60%", "50%"]}
                    $overflow="hidden"
                  >
                    <Box
                      $position="relative"
                      $height={["90%", "100%"]}
                      $transform={[
                        "translate(-30%,30%)",
                        "translate(0,0)",
                        "translate(0,0)",
                      ]}
                    >
                      <Illustration
                        slug="magic-carpet"
                        sizes={getSizes([300, 500])}
                        width={500}
                        height={274}
                        priority
                        $position={["absolute"]}
                        $objectFit="cover"
                        $objectPosition="right"
                        $cover
                      />
                    </Box>
                  </Box>
                  <Heading
                    $ml={[0, "auto"]}
                    $font={["heading-6", "heading-4"]}
                    tag={"h2"}
                  >
                    <CardLink
                      page="classroom"
                      onClick={() =>
                        track.classroomSelected({ navigatedFrom: "card" })
                      }
                    >
                      Classroom
                    </CardLink>
                  </Heading>
                  <Box
                    $position="absolute"
                    $height={[8, 12]}
                    $bottom={[4, 0]}
                    $right={0}
                    $left={0}
                  >
                    <Svg name="underline-2" $color="pupilsHighlight" />
                  </Box>
                </Card>
              </GridArea>
              <GridArea $colSpan={[6, 6]}>
                <Card
                  $background="white"
                  $justifyContent="center"
                  $alignItems="center"
                  $borderRadius={4}
                  $pa={0}
                  $pt={[16, 92]}
                  $pb={[120, 92]}
                  $pr={[null, 56]}
                >
                  <Box
                    $position="absolute"
                    $top={0}
                    $bottom={0}
                    $left={0}
                    $right={[0, "50%"]}
                    $overflow="hidden"
                  >
                    <Box
                      $position="relative"
                      $height={["90%"]}
                      $transform={[
                        "translate(0,40%)",
                        "translate(-20%,30%)",
                        "translate(-10%,30%)",
                      ]}
                    >
                      <Illustration
                        slug="teacher-carrying-stuff"
                        sizes={getSizes([110, 180])}
                        $objectFit="contain"
                        $cover
                        priority
                        noCrop
                      />
                    </Box>
                  </Box>
                  <Heading
                    $ml={[0, "auto"]}
                    $font={["heading-6", "heading-4"]}
                    tag={"h2"}
                  >
                    <CardLink
                      page="teacher-hub"
                      htmlAnchorProps={{
                        onClick: () =>
                          track.teacherHubSelected({ navigatedFrom: "card" }),
                      }}
                    >
                      Teacher Hub
                    </CardLink>
                  </Heading>
                  <Box
                    $position="absolute"
                    $height={[8, 12]}
                    $bottom={[4, 0]}
                    $right={0}
                    $left={0}
                  >
                    <Svg name="underline-2" $color="teachersHighlight" />
                  </Box>
                </Card>
              </GridArea>
            </Grid>
            <HomeSiteCards />
          </MaxWidth>
        </Flex>
      </Flex>
      <SharedHomeContent
        blogListProps={blogListProps}
        pageData={props.pageData}
      />
    </Layout>
  );
};

export const postToPostListItem = (post: SerializedPost): PostListItemProps => {
  return post.type === "blog-post"
    ? blogToPostListItem(post)
    : webinarToPostListItem(post);
};

export const sortByDate = (a: { date: Date }, b: { date: Date }) => {
  return b.date.getTime() - a.date.getTime();
};

export const getAndMergeWebinarsAndBlogs = async (isPreviewMode: boolean) => {
  const blogResults = await CMSClient.blogPosts({
    previewMode: isPreviewMode,
    limit: 5,
  });

  const blogPosts = blogResults.map((blog) => ({
    ...blog,
    type: "blog-post" as const,
  }));

  const webinarResults = await CMSClient.webinars({
    previewMode: isPreviewMode,
    limit: 5,
  });
  const webinars = webinarResults
    .map((webinar) => ({
      ...webinar,
      type: "webinar" as const,
    }))
    .filter((webinar) => webinar.date.getTime() < new Date().getTime());

  return [...blogPosts, ...webinars]
    .sort(sortByDate)
    .slice(0, 4)
    .map(serializeDate);
};

export const getStaticProps: GetStaticProps<HomePageProps> = async (
  context
) => {
  return getPageProps({
    page: "contact-us::getStaticProps",
    context,
    getProps: async () => {
      const isPreviewMode = context.preview === true;

      const homepageData = await CMSClient.homepage({
        previewMode: isPreviewMode,
      });

      if (!homepageData) {
        return {
          notFound: true,
        };
      }

      const posts = await getAndMergeWebinarsAndBlogs(isPreviewMode);

      const results: GetStaticPropsResult<HomePageProps> = {
        props: {
          pageData: homepageData,
          posts,
        },
      };
      return results;
    },
  });
};

export default Home;
