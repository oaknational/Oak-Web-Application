import { NextPage } from "next";

import { BlogListJsonLd } from "../../browser-lib/seo/getJsonLd";
import { getSeoProps } from "../../browser-lib/seo/getSeoProps";
import {
  BlogListingPage,
  BlogPostPreview,
  BlogWebinarCategory,
} from "../../common-lib/cms-types";
import { BlogListItemProps } from "../Blog/BlogList/BlogListItem";
import { getBlogWebinarListBreadcrumbs } from "../Breadcrumbs/getBreadcrumbs";
import SummaryCard from "../Card/SummaryCard";
import Layout from "../Layout";
import MaxWidth from "../MaxWidth/MaxWidth";
import MobileBlogFilters from "../MobileBlogFilters";
import BlogWebinarsListAndCategories from "../Blog/BlogWebinarsListAndCategories";

export type SerializedBlogPostPreview = Omit<BlogPostPreview, "date"> & {
  date: string;
};

export type BlogListingPageProps = {
  blogs: SerializedBlogPostPreview[];
  categories: BlogWebinarCategory[];
  categorySlug: string | null;
  pageData: BlogListingPage;
};

const BlogListingPage: NextPage<BlogListingPageProps> = (props) => {
  const { blogs, categories, categorySlug, pageData } = props;

  const cardImage = {
    src: "/images/illustrations/idea-explosion.png",
    alt: "",
  };

  const blogListItems = blogs.map(blogToBlogListItem);

  return (
    <Layout
      seoProps={getSeoProps({
        title: "Latest Blogs & Insights",
        description:
          "Keep up to date with our latest blog posts, filled with insights, news and updates from Oak National Academy.",
      })}
      $background="white"
      breadcrumbs={getBlogWebinarListBreadcrumbs(
        categories,
        categorySlug,
        "blog",
        "Blog"
      )}
    >
      <MaxWidth $pt={[0, 80, 80]}>
        <SummaryCard
          title={pageData.title}
          heading={
            categories.find((cat) => cat.slug === categorySlug)?.title ||
            pageData.heading
          }
          summary={pageData.summary}
          imageProps={cardImage}
        />

        <MobileBlogFilters
          page={"blog-index"}
          categoryListProps={{
            categories,
            selectedCategorySlug: categorySlug,
          }}
        />

        <BlogWebinarsListAndCategories
          {...props}
          blogs={blogListItems}
          page={"blog-index"}
        />
      </MaxWidth>
      <BlogListJsonLd blogs={props.blogs} />
    </Layout>
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

export default BlogListingPage;
