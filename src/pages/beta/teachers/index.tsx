import { GetStaticProps, GetStaticPropsResult, NextPage } from "next";

import {
  getAndMergeWebinarsAndBlogs,
  HomePageProps,
  postToPostListItem,
} from "../..";
import { DEFAULT_SEO_PROPS } from "../../../browser-lib/seo/Seo";
import AppLayout from "../../../components/AppLayout";
import Box from "../../../components/Box";
import Flex from "../../../components/Flex";
import Grid, { GridArea } from "../../../components/Grid";
import KeyStageKeypad from "../../../components/KeyStageKeypad";
import MaxWidth from "../../../components/MaxWidth/MaxWidth";
import {
  HomeSiteCards,
  SharedHomeContent,
} from "../../../components/pages/Home";
import usePostList from "../../../components/Posts/PostList/usePostList";
import { Heading } from "../../../components/Typography";
import CMSClient from "../../../node-lib/cms";
import curriculumApi, {
  TeachersHomePageData,
} from "../../../node-lib/curriculum-api";
import { decorateWithIsr } from "../../../node-lib/isr";

export type TeachersHomePageProps = HomePageProps & {
  curriculumData: TeachersHomePageData;
};

const Teachers: NextPage<TeachersHomePageProps> = (props) => {
  const { curriculumData } = props;
  const posts = props.posts.map(postToPostListItem);
  const blogListProps = usePostList({ items: posts, withImage: true });

  return (
    <AppLayout seoProps={DEFAULT_SEO_PROPS} $background={"grey1"}>
      <Flex $justifyContent={"center"} $background={"pupilsLightGreen"}>
        <MaxWidth>
          <Box $ph={[16, 0]}>
            <Heading
              $font={["heading-5", "heading-4"]}
              tag={"h1"}
              $mt={120}
              $color={"black"}
            >
              Your foundation for great lessons
            </Heading>
            <Heading $font={"heading-light-6"} tag={"h2"} $mt={8}>
              Find inspiration. Get support. Go teach.
            </Heading>
            <Grid $mt={48}>
              <GridArea $colSpan={[12, 6, 4]}>
                <KeyStageKeypad keyStages={curriculumData.keyStages} />
              </GridArea>
            </Grid>
          </Box>
          <HomeSiteCards />
        </MaxWidth>
      </Flex>
      <SharedHomeContent
        blogListProps={blogListProps}
        pageData={props.pageData}
      />
    </AppLayout>
  );
};

export const getStaticProps: GetStaticProps<HomePageProps> = async (
  context
) => {
  const isPreviewMode = context.preview === true;

  const curriculumData = await curriculumApi.teachersHomePage();

  const teachersHomepageData = await CMSClient.homepage({
    previewMode: isPreviewMode,
  });

  if (!teachersHomepageData) {
    return {
      notFound: true,
    };
  }

  const posts = await getAndMergeWebinarsAndBlogs(isPreviewMode);

  const results: GetStaticPropsResult<TeachersHomePageProps> = {
    props: {
      pageData: teachersHomepageData,
      curriculumData,
      posts,
    },
  };
  const resultsWithIsr = decorateWithIsr(results);
  return resultsWithIsr;
};

export default Teachers;
