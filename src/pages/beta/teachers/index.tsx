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
import OakLink from "../../../components/OakLink";
import {
  HomeSiteCards,
  SharedHomeContent,
} from "../../../components/pages/Home";
import usePostList from "../../../components/Posts/PostList/usePostList";
import SearchForm from "../../../components/SearchForm";
import { Heading, P, Span } from "../../../components/Typography";
import UnderlinedHeading from "../../../components/Typography/UnderlinedHeading";
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
            <Grid $mt={48} $cg={16}>
              <GridArea $colSpan={[12, 6, 4]} $pr={16}>
                <UnderlinedHeading $font={"heading-6"} tag={"h2"} $mt={8}>
                  Search our resources by topic
                </UnderlinedHeading>
                <P $mt={16} $font={"body-2"}>
                  Discover thousands of free, adaptable teaching resources,
                  including slides, worksheets and&nbsp;quizzes.
                </P>
                <Box $mt={16}>
                  <SearchForm />
                </Box>
                <P $mt={18} $font={"body-2"}>
                  Search suggestions:
                </P>
                <Span>
                  <OakLink
                    page={"beta-search"}
                    term={"algebra"}
                    $color={"black"}
                    $font="heading-7"
                  >
                    Algebra,&nbsp;
                  </OakLink>
                  <OakLink
                    page={"beta-search"}
                    term={"computing"}
                    $color={"black"}
                    $font="heading-7"
                  >
                    Computing,&nbsp;
                  </OakLink>

                  <OakLink
                    page={"beta-search"}
                    term={"a+midsummer+nights+dream"}
                    $font="heading-7"
                  >
                    A Midsummer Night's Dream
                  </OakLink>
                </Span>
              </GridArea>
              <GridArea $colSpan={[12, 6, 4]} $mt={[56, 0]}>
                <UnderlinedHeading $font={"heading-6"} tag={"h2"} $mt={8}>
                  Start exploring subjects
                </UnderlinedHeading>
                <P $mt={16} $font={"body-2"}>
                  Select a key stage to find teaching resources in your
                  subject&nbsp;area.
                </P>
                <Box $mt={40}>
                  <KeyStageKeypad keyStages={curriculumData.keyStages} />
                </Box>
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
