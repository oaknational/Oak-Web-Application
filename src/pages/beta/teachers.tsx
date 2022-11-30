import { GetStaticProps, GetStaticPropsResult, NextPage } from "next";

import keyStageKeypad from "../../browser-lib/fixtures/keyStagesKeypad";
import AppLayout from "../../components/AppLayout";
import { DEFAULT_SEO_PROPS } from "../../browser-lib/seo/Seo";
import { Heading } from "../../components/Typography";
import {
  getAndMergeWebinarsAndBlogs,
  HomePageProps,
  postToPostListItem,
} from "..";
import CMSClient from "../../node-lib/cms";
import { decorateWithIsr } from "../../node-lib/isr";
import Flex from "../../components/Flex";
import MaxWidth from "../../components/MaxWidth/MaxWidth";
import { HomeSiteCards, SharedHomeContent } from "../../components/pages/Home";
import KeyStageKeypad from "../../components/KeyStageKeypad";
import Grid, { GridArea } from "../../components/Grid";
import usePostList from "../../components/Posts/PostList/usePostList";

const Teachers: NextPage<HomePageProps> = (props) => {
  const posts = props.posts.map(postToPostListItem);
  const blogListProps = usePostList({ items: posts, withImage: true });

  return (
    <AppLayout seoProps={DEFAULT_SEO_PROPS} $background={"grey1"}>
      <Flex $justifyContent={"center"} $background={"pupilsLightGreen"}>
        <MaxWidth>
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
              <KeyStageKeypad keyStages={keyStageKeypad.keyStages} />
            </GridArea>
          </Grid>
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

  const teachersHomepageData = await CMSClient.homepage({
    previewMode: isPreviewMode,
  });

  if (!teachersHomepageData) {
    return {
      notFound: true,
    };
  }

  const posts = await getAndMergeWebinarsAndBlogs(isPreviewMode);

  const results: GetStaticPropsResult<HomePageProps> = {
    props: {
      pageData: teachersHomepageData,
      posts,
    },
  };
  const resultsWithIsr = decorateWithIsr(results);
  return resultsWithIsr;
};

export default Teachers;
