import { ParsedUrlQuery } from "querystring";

import { GetStaticPropsContext, GetStaticPropsResult, PreviewData } from "next";

import {
  HomePage,
  SerializedBlogPostPreview,
  SerializedWebinarPreview,
} from "@/common-lib/cms-types";
import { getAndMergeWebinarsAndBlogs } from "@/utils/getAndMergeWebinarsAndBlogs";
import CMSClient from "@/node-lib/cms";

export type SerializedPost =
  | ({ type: "blog-post" } & SerializedBlogPostPreview)
  | ({ type: "webinar" } & SerializedWebinarPreview);

export type HomePageProps = {
  pageData: HomePage;
  posts: SerializedPost[];
};

export const getBlogPosts = async (isPreviewMode: boolean, limit: number) => {
  const pageData = await CMSClient.homepage({
    previewMode: isPreviewMode,
  });

  const posts = await getAndMergeWebinarsAndBlogs(isPreviewMode, limit);

  return {
    pageData,
    posts,
  };
};

export const getPropsFunction =
  (
    context: GetStaticPropsContext<ParsedUrlQuery, PreviewData>,
  ): (() => Promise<GetStaticPropsResult<HomePageProps>>) =>
  async () => {
    const { pageData, posts } = await getBlogPosts(context.preview === true, 5);

    if (!pageData) {
      return {
        notFound: true,
      };
    }

    const results: GetStaticPropsResult<HomePageProps> = {
      props: {
        pageData,
        posts,
      },
    };
    return results;
  };
