import { uniqBy } from "lodash/fp";
import { GetStaticProps, GetStaticPropsResult } from "next";

import { BlogListingPageProps } from "../../components/pages/BlogIndex.page";
import CMSClient from "../../node-lib/cms";
import { decorateWithIsr } from "../../node-lib/isr";
import { serializeDate } from "../../utils/serializeDate";

export { default } from "../../components/pages/BlogIndex.page";

export const getStaticProps: GetStaticProps<
  BlogListingPageProps,
  // @todo is below typesafe?
  { categorySlug?: string }
> = async (context) => {
  const isPreviewMode = context.preview === true;

  const blogResults = await CMSClient.blogPosts({
    previewMode: isPreviewMode,
  });

  const blogCategories = uniqBy(
    "title",
    blogResults.map((blogResult) => blogResult.category)
  ).sort((a, b) => (a.title < b.title ? -1 : 1));

  const categorySlug = context.params?.categorySlug || null;
  const blogs = blogResults.map(serializeDate).filter((blog) => {
    if (categorySlug) {
      return blog.category.slug === categorySlug;
    }
    return true;
  });

  const results: GetStaticPropsResult<BlogListingPageProps> = {
    props: {
      blogs,
      categories: blogCategories,
      categorySlug,
    },
  };
  const resultsWithIsr = decorateWithIsr(results);

  return resultsWithIsr;
};
