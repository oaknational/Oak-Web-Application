import { GetStaticProps, GetStaticPropsResult, NextPage } from "next";
import { useEffect, useState } from "react";

import { DEFAULT_SEO_PROPS } from "@/browser-lib/seo/Seo";
import AppLayout from "@/components/SharedComponents/AppLayout";
import Flex from "@/components/SharedComponents/Flex.deprecated";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import usePostList from "@/components/SharedComponents/PostList/usePostList";
import CMSClient from "@/node-lib/cms";
import useAnalytics from "@/context/Analytics/useAnalytics";
import getPageProps from "@/node-lib/getPageProps";
import { useNewsletterForm } from "@/components/GenericPagesComponents/NewsletterForm";
import NewsletterFormWrap from "@/components/GenericPagesComponents/NewsletterFormWrap";
import HomePageTabImageNav from "@/components/GenericPagesComponents/HomePageTabImageNav";
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
import { PostListItemProps } from "@/components/SharedComponents/PostListItem";
import curriculumApi2023, {
  TeachersHomePageData,
} from "@/node-lib/curriculum-api-2023";
import BlogAndWebinarList from "@/components/GenericPagesComponents/BlogAndWebinarList";
import { getAndMergeWebinarsAndBlogs } from "@/utils/getAndMergeWebinarsAndBlogs";

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
        <TeachersTab keyStages={curriculumData.keyStages} aria-current="page" />
      )}
      {current === "curriculum" && <CurriculumTab aria-current="page" />}
      {current === "pupils" && <PupilTab aria-current="page" />}
      {current === "ai" && <AiTab aria-current="page" />}

      <MaxWidth>
        <BlogAndWebinarList
          blogListPosts={blogListProps}
          showImageOnTablet={true}
          backgroundColor="white"
          displayOnPhone={true}
          isBackgroundWhite={true}
          title={"Stay up to date"}
        />
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

      const posts = await getAndMergeWebinarsAndBlogs(isPreviewMode, 5);

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
