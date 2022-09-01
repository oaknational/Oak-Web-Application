import { FC } from "react";
import { GetStaticProps, NextPage } from "next";
import Image from "next/image";
import Link from "next/link";

import { DEFAULT_SEO_PROPS } from "../browser-lib/seo/Seo";
import CMSClient, { WebinarPreview } from "../node-lib/cms";
import Grid from "../components/Grid";
import GridArea from "../components/Grid/GridArea";
import Card from "../components/Card";
import Typography, { Heading, P, Span } from "../components/Typography";
import CardLink from "../components/Card/CardLink";
import MaxWidth from "../components/MaxWidth/MaxWidth";
import CardLinkIcon from "../components/Card/CardLinkIcon";
import Box from "../components/Box";
import Layout from "../components/Layout";
import BoxBorders from "../components/SpriteSheet/BrushSvgs/BoxBorders";
import Flex from "../components/Flex";
import Icon from "../components/Icon";
import HomeAboutCard from "../components/pages/Home/HomeAboutCard";
import HomeHelpCard from "../components/pages/Home/HomeHelpCard";
import NewsletterForm, {
  useNewsletterForm,
} from "../components/Forms/NewsletterForm";
import Svg from "../components/Svg";
import useAnalytics from "../context/Analytics/useAnalytics";
import { getPupilsUrl, getTeachersUrl } from "../common-lib/urls";
import BlogListItem, {
  BlogListItemProps,
} from "../components/BlogList/BlogListItem";

import {
  blogToBlogListItem,
  serializeDate,
  SerializedBlogPostPreview,
} from "./blog";
import { SerializedWebinarPreview, webinarToBlogListItem } from "./webinars";

const Notification: FC = () => {
  const { track } = useAnalytics();
  const href = "/blog/evolution-of-oak";
  const heading = "About the future of Oak";
  return (
    <Card
      $background="white"
      $flexGrow={0}
      $transform={[undefined, "rotate(2deg)"]}
      $pa={16}
      $pr={[0, 48]}
      $dropShadow="notificationCard"
    >
      <BoxBorders />
      <Box
        $position="absolute"
        $top={0}
        $left={0}
        $transform="translate(-40%,-40%)"
      >
        <Icon
          name="Bell"
          $background="pupilsHighlight"
          variant="brush"
          size={30}
        />
      </Box>
      <Span $fontSize={14} $color="oakGrey4">
        Blog
      </Span>
      <Heading $fontSize={20} tag="h2" $mt={4}>
        <CardLink
          href={href}
          onClick={() =>
            track.notificationSelected({
              linkUrl: href,
              notificationHeadline: heading,
            })
          }
        >
          {heading}
        </CardLink>
      </Heading>
      <P $mt={4}>Find out more</P>
    </Card>
  );
};

export type SerializedPost =
  | ({ type: "blog-post" } & SerializedBlogPostPreview)
  | ({ type: "webinar" } & SerializedWebinarPreview);

export type HomePageProps = {
  posts: SerializedPost[];
  // webinars
  isPreviewMode: boolean;
};

const Home: NextPage<HomePageProps> = (props) => {
  const { track } = useAnalytics();
  const newsletterFormProps = useNewsletterForm({
    onSubmit: track.newsletterSignUpCompleted,
  });
  const posts = props.posts.map(postToBlogListItem);

  return (
    <Layout seoProps={DEFAULT_SEO_PROPS} isPreviewMode={props.isPreviewMode}>
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
                $justifyContent="flex-end"
              >
                <Heading
                  $fontSize={[32]}
                  tag={"h1"}
                  $mb={[20, 16]}
                  data-testid="home-page-title"
                  $color={"black"}
                >
                  Oak is evolving
                </Heading>
                <Heading tag={"h2"} $fontSize={[20]}>
                  We’re growing our support to help you thrive.
                </Heading>
              </Flex>
              <Box $ph={[16, 0]}>
                <Notification />
              </Box>
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
                    $right={[56, "60%", "50%"]}
                    $overflow="hidden"
                  >
                    <Box
                      $position="relative"
                      $height="100%"
                      $top={[32, 0]}
                      $bottom={[-32, 0]}
                    >
                      <Image
                        alt={""}
                        src={"/images/illustrations/magic-carpet.png"}
                        layout="fill"
                        objectFit="cover"
                        objectPosition={"right center"}
                        priority
                      />
                    </Box>
                  </Box>
                  <Heading
                    $ml={[0, "auto"]}
                    $fontSize={[20, 32]}
                    tag={"h3"}
                    $color={"black"}
                  >
                    <CardLink
                      href={getPupilsUrl()}
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
                    <Svg name="Underline2" $color="pupilsHighlight" />
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
                      $height={["90%"]}
                      $transform={[
                        "translate(0,40%)",
                        "translate(-20%,30%)",
                        "translate(-10%,30%)",
                      ]}
                    >
                      <Image
                        alt=""
                        src={"/images/illustrations/teacher-carrying-stuff.png"}
                        layout="fill"
                        objectFit="contain"
                        priority
                      />
                    </Box>
                  </Box>
                  <Heading
                    $ml={[0, "auto"]}
                    $fontSize={[20, 32]}
                    tag={"h3"}
                    $color={"black"}
                  >
                    <CardLink
                      href={getTeachersUrl()}
                      onClick={() =>
                        track.teacherHubSelected({ navigatedFrom: "card" })
                      }
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
                    <Svg name="Underline2" $color="teachersHighlight" />
                  </Box>
                </Card>
              </GridArea>
            </Grid>
            <Grid $cg={[8, 16]} $ph={[12, 0]}>
              <GridArea $transform={["translateY(50%)"]} $colSpan={[12, 6]}>
                <CardLinkIcon
                  title={"Plan a lesson"}
                  titleTag={"h4"}
                  background="pupilsLimeGreen"
                  href={"/lesson-planning"}
                  cardLinkProps={{ onClick: track.planALessonSelected }}
                />
              </GridArea>
              <GridArea $transform={["translateY(50%)"]} $colSpan={[12, 6]}>
                <CardLinkIcon
                  title={"Develop your curriculum"}
                  titleTag={"h4"}
                  background={"teachersYellow"}
                  href={"/develop-your-curriculum"}
                  cardLinkProps={{
                    onClick: track.developYourCurriculumSelected,
                  }}
                />
              </GridArea>
            </Grid>
          </MaxWidth>
        </Flex>
      </Flex>
      <Flex $background={"teachersPastelYellow"} $justifyContent={"center"}>
        <MaxWidth $ph={[0, 12]} $mt={[80, 32]} $mb={64}>
          <Grid $cg={[16, 32]} $rg={[0, 32]} $mt={[16, 80]}>
            <GridArea $colSpan={[12, 4]} $order={[0, 0]}>
              <HomeAboutCard />
            </GridArea>
            <GridArea
              $mb={[64, 0]}
              $colSpan={[12, 8]}
              $rowSpan={3}
              $order={[3, 0]}
            >
              <Box $background={"white"} $pa={24}>
                <Flex
                  $alignItems="center"
                  $justifyContent="space-between"
                  $mb={48}
                >
                  <Heading tag={"h3"} $fontSize={24} $fontFamily="heading">
                    Stay up to date!
                  </Heading>

                  <Typography $fontFamily="ui">
                    {/* <Link href={"/webinars"}>All webinars</Link> */}
                    <Link href={"/blog"}>All blogs</Link>
                  </Typography>
                </Flex>

                <Flex
                  $flexDirection="column"
                  as="ul"
                  role="list" /* role=list to strip default ul styling */
                >
                  {posts.map((item, i) => (
                    <li key={`BlogList-BlogListItem-${i}`}>
                      <BlogListItem {...item} withImage={true} />
                    </li>
                  ))}
                </Flex>
              </Box>
            </GridArea>
            <GridArea $mb={[64, 0]} $colSpan={[12, 4]} $order={[2, 0]}>
              <HomeHelpCard />
            </GridArea>
            <GridArea $colSpan={[12, 4]} $order={[4, 0]}>
              <NewsletterForm {...newsletterFormProps} />
            </GridArea>
          </Grid>
        </MaxWidth>
      </Flex>
    </Layout>
  );
};

export const postToBlogListItem = (
  blogOrWebinar: SerializedPost
): BlogListItemProps => {
  return blogOrWebinar.type === "blog-post"
    ? blogToBlogListItem(blogOrWebinar)
    : webinarToBlogListItem(blogOrWebinar);
};

const sortByDate = (a: { date: Date }, b: { date: Date }) => {
  return b.date.getTime() - a.date.getTime();
};

export const getStaticProps: GetStaticProps<HomePageProps> = async (
  context
) => {
  const isPreviewMode = context.preview === true;

  const blogResults = await CMSClient.blogPosts({
    previewMode: isPreviewMode,
    limit: 5,
  });

  // const webinarResults = await CMSClient.webinars({
  //   previewMode: isPreviewMode,
  //   limit: 5,
  // });
  const webinarResults: WebinarPreview[] = [];

  const blogPosts = blogResults.map((blog) => ({
    ...blog,
    type: "blog-post" as const,
  }));

  const webinars = webinarResults.map((webinar) => ({
    ...webinar,
    type: "webinar" as const,
  }));

  const posts = [...blogPosts, ...webinars]
    .sort(sortByDate)
    .slice(0, 5)
    .map(serializeDate);

  return {
    props: {
      posts,
      isPreviewMode,
    },
    revalidate: 10,
  };
};

export default Home;
