import { GetStaticProps, GetStaticPropsResult, NextPage } from "next";
import { useEffect, useState } from "react";

import Typography, { Heading } from "@/components/SharedComponents/Typography";
import { DEFAULT_SEO_PROPS } from "@/browser-lib/seo/Seo";
import AppLayout from "@/components/SharedComponents/AppLayout";
import Box from "@/components/SharedComponents/Box";
import Flex from "@/components/SharedComponents/Flex";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import OakLink from "@/components/OakLink";
import usePostList from "@/components/SharedComponents/PostList/usePostList";
import CMSClient from "@/node-lib/cms";
import { TeachersHomePageData } from "@/node-lib/curriculum-api";
import useAnalytics from "@/context/Analytics/useAnalytics";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import getPageProps from "@/node-lib/getPageProps";
import PostList from "@/components/SharedComponents/PostList";
import { useNewsletterForm } from "@/components/Forms/NewsletterForm";
import NewsletterFormWrap from "@/components/Forms/NewsletterForm/NewsletterFormWrap";
import HomePageTabImageNav from "@/components/HomePageTabImageNav/HomePageTabImageNav";
import TeachersTab from "@/components/GenericPagesComponents/TeachersTab";
import CurriculumTab from "@/components/GenericPagesComponents/CurriculumTab";
import PupilTab from "@/components/GenericPagesComponents/PupilTab";
import AiTab from "@/components/GenericPagesComponents/AiTab";
import {
  SerializedBlogPostPreview,
  blogToPostListItem,
} from "@/components/GenericPagesViews/BlogIndex.view";
import {
  SerializedWebinarPreview,
  webinarToPostListItem,
} from "@/components/GenericPagesViews/WebinarsIndex.view";
import { HomePage } from "@/common-lib/cms-types";
import { serializeDate } from "@/utils/serializeDate";
import { PostListItemProps } from "@/components/SharedComponents/PostListItem";

export type TeachersHomePageProps = HomePageProps & {
  curriculumData: TeachersHomePageData;
};

export type SerializedPost =
  | ({ type: "blog-post" } & SerializedBlogPostPreview)
  | ({ type: "webinar" } & SerializedWebinarPreview);

export type HomePageProps = {
  pageData: HomePage;
  posts: SerializedPost[];
};

export type HomePageTab = "teachers" | "curriculum" | "pupils" | "ai";
const isHomePageTab = (u: unknown): u is HomePageTab =>
  u === "teachers" || u === "curriculum" || u === "pupils" || u === "ai";

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

const Teachers: NextPage<TeachersHomePageProps> = (props) => {
  const { curriculumData } = props;
  const posts = props.posts.map(postToPostListItem);
  const [current, setCurrent] = useState<HomePageTab | undefined>();
  const blogListProps = usePostList({ items: posts, withImage: true });
  const { track } = useAnalytics();
  const newsletterFormProps = useNewsletterForm({
    onSubmit: track.newsletterSignUpCompleted,
  });

  useEffect(() => {
    const tabHash = window.location.hash;
    const tabName = tabHash.slice(1);

    if (isHomePageTab(tabName) && current !== tabName) {
      setCurrent(tabName as HomePageTab);
    } else if (current === undefined) {
      // default value when first loading the page or invalid hash
      setActiveTab("teachers");
    }
  }, [current]);

  const setActiveTab = (tab: HomePageTab) => {
    setCurrent(tab);
    const newUrl = `#${tab}`;
    // using window history instead of nextjs router to avoid re-rendering the page when the anchor changes
    // see https://github.com/vercel/next.js/discussions/18072
    window.history.replaceState(
      { ...window.history.state, as: newUrl, url: newUrl },
      "",
      newUrl,
    );
  };

  return (
    <AppLayout seoProps={DEFAULT_SEO_PROPS} $background={"white"}>
      <HomePageTabImageNav current={current} setCurrent={setActiveTab} />
      {current === "teachers" && (
        <TeachersTab keyStages={curriculumData.keyStages} />
      )}
      {current === "curriculum" && <CurriculumTab />}
      {current === "pupils" && <PupilTab />}
      {current === "ai" && <AiTab />}

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

export const getStaticProps: GetStaticProps<HomePageProps> = async (
  context,
) => {
  return getPageProps({
    page: "teachers-home-page::getStaticProps",
    context,
    getProps: async () => {
      const isPreviewMode = context.preview === true;
      const curriculumData = await curriculumApi2023.teachersHomePage();

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
