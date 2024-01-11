import { NextPage } from "next";

import {
  PostListingPage,
  BlogPostPreview,
  BlogWebinarCategory,
} from "@/common-lib/cms-types";
import { PostListItemProps } from "@/components/SharedComponents/PostListItem";
import PostListing from "@/components/GenericPagesViews/PostListing.view";
import { PAGE_SIZE } from "@/components/SharedComponents/PostList/usePostList";
import usePagination from "@/components/SharedComponents/Pagination/usePagination";

export type SerializedBlogPostPreview = Omit<BlogPostPreview, "date"> & {
  date: string;
};

export type PostListingPageProps = {
  blogs: SerializedBlogPostPreview[];
  categories: BlogWebinarCategory[];
  categorySlug: string | null;
  pageData: PostListingPage;
};

const BlogIndexPage: NextPage<PostListingPageProps> = (props) => {
  const { blogs, categories, categorySlug, pageData } = props;
  const paginationProps = usePagination({
    totalResults: blogs.length,
    pageSize: PAGE_SIZE,
    items: blogs,
  });
  const { paginationTitle } = paginationProps;

  return (
    <PostListing
      seo={{
        title: `${
          pageData.seo?.title || "Latest Blogs & Insights"
        }${paginationTitle}`,
        description:
          pageData.seo?.description ||
          "Keep up to date with our latest blog posts, filled with insights, news and updates from Oak National Academy.",
        canonicalURL: pageData.seo?.canonicalURL || undefined,
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

export const blogToPostListItem = (
  blog: SerializedBlogPostPreview,
): PostListItemProps => ({
  ...blog,
  summary: blog.summaryPortableText?.trim(),
  contentType: "blog-post",
  titleTag: "h3",
  category: blog.category,
  date: blog.date,
  mainImage: blog?.mainImage,
});

export default BlogIndexPage;
