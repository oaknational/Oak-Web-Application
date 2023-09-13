import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";

import {
  HomePageProps,
  getAndMergeWebinarsAndBlogs,
  postToPostListItem,
} from "..";

import Typography, { Heading, P, Span } from "@/components/Typography";
import { BETA_SEO_PROPS } from "@/browser-lib/seo/Seo";
import AppLayout from "@/components/AppLayout";
import Box from "@/components/Box";
import Flex from "@/components/Flex";
import Grid, { GridArea } from "@/components/Grid";
import KeyStageKeypad from "@/components/KeyStageKeypad";
import MaxWidth from "@/components/MaxWidth/MaxWidth";
import OakLink from "@/components/OakLink";
import usePostList from "@/components/Posts/PostList/usePostList";
import SearchForm from "@/components/SearchForm";
import UnderlinedHeading from "@/components/Typography/UnderlinedHeading";
import useSearch from "@/context/Search/useSearch";
import CMSClient from "@/node-lib/cms";
import curriculumApi, { TeachersHomePageData } from "@/node-lib/curriculum-api";
import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import useAnalytics from "@/context/Analytics/useAnalytics";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import { ViewType } from "@/common-lib/urls";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import getPageProps from "@/node-lib/getPageProps";
import PostList from "@/components/Posts/PostList";
import { useNewsletterForm } from "@/components/Forms/NewsletterForm";
import NewsletterFormWrap from "@/components/Forms/NewsletterForm/NewsletterFormWrap";

export type TeachersHomePageProps = HomePageProps & {
  curriculumData: TeachersHomePageData;
};

const Teachers: NextPage<TeachersHomePageProps> = (props) => {
  const { curriculumData } = props;
  const posts = props.posts.map(postToPostListItem);
  const blogListProps = usePostList({ items: posts, withImage: true });
  const { setSearchTerm } = useSearch({});

  const { track } = useAnalytics();
  const { analyticsUseCase, pageName } = useAnalyticsPageProps();
  const trackSearchAttempted = (searchTerm: string) => {
    track.searchAttempted({
      searchTerm: searchTerm,
      analyticsUseCase: analyticsUseCase,
      pageName,
      searchFilterOptionSelected: [],
      searchSource: "homepage search suggestion",
    });
  };
  const newsletterFormProps = useNewsletterForm({
    onSubmit: track.newsletterSignUpCompleted,
  });

  return (
    <AppLayout seoProps={BETA_SEO_PROPS} $background={"white"}>
      <Flex $justifyContent={"center"} $background={"pupilsLightGreen"}>
        <MaxWidth $mb={[48, 24]}>
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
                  <SearchForm
                    searchTerm=""
                    handleSubmit={(value) => {
                      setSearchTerm(value);
                    }}
                    analyticsSearchSource={"homepage search box"}
                  />
                </Box>
                <P $mt={18} $font={"body-2"}>
                  Search suggestions:
                </P>
                <Span>
                  <OakLink
                    page={"search"}
                    viewType="teachers"
                    query={{ term: "algebra" }}
                    $color={"black"}
                    $font="heading-7"
                    onClick={() => trackSearchAttempted("algebra")}
                  >
                    Algebra,&nbsp;
                  </OakLink>
                  <OakLink
                    page={"search"}
                    viewType="teachers"
                    query={{ term: "computing" }}
                    $color={"black"}
                    $font="heading-7"
                    onClick={() => trackSearchAttempted("computing")}
                  >
                    Computing,&nbsp;
                  </OakLink>

                  <OakLink
                    page={"search"}
                    viewType="teachers"
                    query={{ term: "a midsummer nights dream" }}
                    $font="heading-7"
                    onClick={() =>
                      trackSearchAttempted("a midsummer nights dream")
                    }
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
        </MaxWidth>
      </Flex>
      <MaxWidth $mv={[24, 56]}>
        <Box $ph={[16, 24]} $height={"100%"}>
          <Flex
            $width={"100%"}
            $alignItems={["flex-start", "center"]}
            $justifyContent="space-between"
            $mb={48}
            $flexDirection={["column", "row"]}
          >
            <Heading $mb={[24, 0]} tag={"h2"} $font={"heading-5"}>
              Stay up to date
            </Heading>
            <Flex $flexDirection={"row"}>
              <Typography $mr={16} $font="heading-7">
                <OakLink page={"webinar-index"}>All webinars</OakLink>
              </Typography>
              <Typography $font="heading-7">
                <OakLink page={"blog-index"}>All blogs</OakLink>
              </Typography>
            </Flex>
          </Flex>
          <PostList showImageOnTablet={true} {...blogListProps} />
        </Box>
      </MaxWidth>
      <Flex $background={"lavender50"} $width={"100%"}>
        <MaxWidth
          $alignItems={"center"}
          $background={"lavender50"}
          $mt={58}
          $mb={80}
          $ph={16}
        >
          <Flex $maxWidth={["100%", 870]}>
            <NewsletterFormWrap desktopColSpan={6} {...newsletterFormProps} />
          </Flex>
        </MaxWidth>
      </Flex>
    </AppLayout>
  );
};

type URLParams = {
  viewType: ViewType;
};

export const getStaticPaths = async () => {
  if (shouldSkipInitialBuild) {
    return getFallbackBlockingConfig();
  }

  const config: GetStaticPathsResult<URLParams> = {
    fallback: "blocking",
    paths: [],
  };
  return config;
};

export const getStaticProps: GetStaticProps<HomePageProps> = async (
  context,
) => {
  return getPageProps({
    page: "teachers-home-page::getStaticProps",
    context,
    getProps: async () => {
      const isPreviewMode = context.preview === true;
      console.log(context?.params?.viewType);
      const curriculumData =
        context?.params?.viewType === "teachers-2023"
          ? await curriculumApi2023.teachersHomePage()
          : await curriculumApi.teachersHomePage();

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
      return results;
    },
  });
};

export default Teachers;
