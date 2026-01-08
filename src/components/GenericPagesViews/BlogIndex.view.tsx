import { NextPage } from "next";

import {
  PostListingPage,
  BlogWebinarCategory,
  SerializedBlogPostPreview,
} from "@/common-lib/cms-types";
import { PostListItemProps } from "@/components/SharedComponents/PostListItem";
import PostListing from "@/components/GenericPagesViews/PostListing.view";
import { PAGE_SIZE } from "@/components/SharedComponents/PostList/usePostList";
import usePagination from "@/components/SharedComponents/Pagination/usePagination";
import PaginationHead from "@/components/SharedComponents/Pagination/PaginationHead";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";

export type PostListingPageProps = {
  blogs: SerializedBlogPostPreview[];
  categories: BlogWebinarCategory[];
  categorySlug: string | null;
  pageData: PostListingPage;
  topNav: TopNavProps;
};

const BlogIndexPage: NextPage<PostListingPageProps> = (props) => {
  const { blogs, categories, categorySlug, pageData, topNav } = props;
  const paginationProps = usePagination({
    totalResults: blogs.length,
    pageSize: PAGE_SIZE,
    items: blogs,
  });
  const {
    paginationTitle,
    prevPageUrlObject,
    nextPageUrlObject,
    isLastPage,
    isFirstPage,
  } = paginationProps;

  return (
    <>
      <PaginationHead
        prevPageUrlObject={prevPageUrlObject}
        nextPageUrlObject={nextPageUrlObject}
        isFirstPage={isFirstPage}
        isLastPage={isLastPage}
      />
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
        topNav={topNav}
      />
    </>
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
