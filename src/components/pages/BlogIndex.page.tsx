import { NextPage } from "next";

import {
  BlogListingPage,
  BlogPostPreview,
  BlogWebinarCategory,
} from "../../common-lib/cms-types";
import { BlogListItemProps } from "../Blog/BlogList/BlogListItem";
import PostListing from "../Posts/PostListing";

export type SerializedBlogPostPreview = Omit<BlogPostPreview, "date"> & {
  date: string;
};

export type BlogListingPageProps = {
  blogs: SerializedBlogPostPreview[];
  categories: BlogWebinarCategory[];
  categorySlug: string | null;
  pageData: BlogListingPage;
};

const BlogIndexPage: NextPage<BlogListingPageProps> = (props) => {
  const { blogs, categories, categorySlug, pageData } = props;
  return (
    <PostListing
      seo={{
        title: "Latest Blogs & Insights",
        description:
          "Keep up to date with our latest blog posts, filled with insights, news and updates from Oak National Academy.",
      }}
      pageData={pageData}
      categories={categories}
      categorySlug={categorySlug}
      postsWithCategories={props}
      page={"blog-index"}
      posts={blogs}
      variant={{
        slug: "blog",
        title: "Blog",
      }}
    />
  );
};

export const blogToBlogListItem = (
  blog: SerializedBlogPostPreview
): BlogListItemProps => ({
  ...blog,
  contentType: "blog-post",
  titleTag: "h3",
  category: blog.category,
  date: blog.date,
  mainImage: blog?.mainImage,
});

export default BlogIndexPage;
