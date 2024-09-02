import { GetStaticProps, GetStaticPropsResult, NextPage } from "next";

import { DEFAULT_SEO_PROPS } from "@/browser-lib/seo/Seo";
import AppLayout from "@/components/SharedComponents/AppLayout";
import CMSClient from "@/node-lib/cms";
import getPageProps from "@/node-lib/getPageProps";
import HomePageTabImageNav from "@/components/GenericPagesComponents/HomePageTabImageNav";
import { SerializedBlogPostPreview } from "@/components/GenericPagesViews/BlogIndex.view";
import { SerializedWebinarPreview } from "@/components/GenericPagesViews/WebinarsIndex.view";
import { HomePage } from "@/common-lib/cms-types";
import { getAndMergeWebinarsAndBlogs } from "@/utils/getAndMergeWebinarsAndBlogs";
import { HomePageLowerView } from "@/components/GenericPagesViews/HomePageLower/HomePageLower.view";
import AiTab from "@/components/GenericPagesComponents/AiTab";

export type SerializedPost =
  | ({ type: "blog-post" } & SerializedBlogPostPreview)
  | ({ type: "webinar" } & SerializedWebinarPreview);

export type PupilHomePageProps = {
  pageData: HomePage;
  posts: SerializedPost[];
};

const Ai: NextPage<PupilHomePageProps> = (props) => (
  <AppLayout seoProps={DEFAULT_SEO_PROPS} $background={"white"}>
    <HomePageTabImageNav current={"ai"} />
    <AiTab aria-current="page" />
    <HomePageLowerView posts={props.posts} />
  </AppLayout>
);

export const getStaticProps: GetStaticProps<PupilHomePageProps> = async (
  context,
) => {
  return getPageProps({
    page: "curriculum-home-page::getStaticProps",
    context,
    getProps: async () => {
      const isPreviewMode = context.preview === true;

      const pageData = await CMSClient.homepage({
        previewMode: isPreviewMode,
      });

      if (!pageData) {
        return {
          notFound: true,
        };
      }

      const posts = await getAndMergeWebinarsAndBlogs(isPreviewMode, 5);

      const results: GetStaticPropsResult<PupilHomePageProps> = {
        props: {
          pageData,
          posts,
        },
      };
      return results;
    },
  });
};

export default Ai;
