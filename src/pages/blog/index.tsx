import { uniqBy } from "lodash/fp";
import { GetStaticProps, GetStaticPropsResult } from "next";

import { PostListingPageProps } from "../../components/pages/BlogIndex.page";
import CMSClient from "../../node-lib/cms";
import { serializeDate } from "../../utils/serializeDate";
import getPageProps from "../../node-lib/getPageProps";

export { default } from "../../components/pages/BlogIndex.page";

export const getStaticProps: GetStaticProps<
  PostListingPageProps,
  { categorySlug?: string }
> = async (context) => {
  return getPageProps({
    page: "blog-listing::getStaticProps",
    context,
    getProps: async () => {
      const isPreviewMode = context.preview === true;

      const pageData = await CMSClient.blogListingPage({
        previewMode: isPreviewMode,
      });

      if (!pageData) {
        return {
          notFound: true,
        };
      }

      const blogResults = await CMSClient.blogPosts({
        previewMode: isPreviewMode,
      });

      const blogCategories = uniqBy(
        "title",
        blogResults.map((blogResult) => blogResult.category),
      ).sort((a, b) => (a.title < b.title ? -1 : 1));

      const categorySlug = context.params?.categorySlug || null;
      const blogs = blogResults
        .map((blog) => serializeDate(blog))
        .filter((blog) => {
          if (categorySlug) {
            return blog.category.slug === categorySlug;
          }
          return true;
        });

      const results: GetStaticPropsResult<PostListingPageProps> = {
        props: {
          blogs,
          categories: blogCategories,
          categorySlug,
          pageData,
        },
      };

      return results;
    },
  });
};
