import { FC } from "react";

import { getSeoProps } from "../../browser-lib/seo/getSeoProps";
import {
  BlogListingPage,
  BlogWebinarCategory,
} from "../../common-lib/cms-types";
import { WebinarsListingPage } from "../../common-lib/cms-types/webinarsListingPage";
import BlogWebinarsListAndCategories from "../Blog/BlogWebinarsListAndCategories";
import {
  CrumbPageVariant,
  getBlogWebinarListBreadcrumbs,
} from "../Breadcrumbs/getBreadcrumbs";
import SummaryCard from "../Card/SummaryCard";
import Layout from "../Layout";
import MaxWidth from "../MaxWidth/MaxWidth";
import MobileBlogFilters from "../MobileBlogFilters";
import {
  BlogListingPageProps,
  blogToBlogListItem,
  SerializedBlogPostPreview,
} from "../pages/BlogIndex.page";
import {
  SerializedWebinarPreview,
  WebinarListingPageProps,
  webinarToBlogListItem,
} from "../pages/WebinarsIndex.page";
import { BlogListJsonLd } from "../../browser-lib/seo/getJsonLd";
import { BlogCategoryPage } from "../Blog/BlogCategoryList/BlogCategoryList";
import { SeoProps } from "../../browser-lib/seo/Seo";

type PostListingProps = {
  seo: SeoProps;
  pageData: WebinarsListingPage | BlogListingPage;
  categories: BlogWebinarCategory[];
  categorySlug: string | null;
  postsWithCategories: WebinarListingPageProps | BlogListingPageProps;
  posts: SerializedBlogPostPreview[] | SerializedWebinarPreview[];
  page: BlogCategoryPage;
  variant: {
    slug: CrumbPageVariant;
    title: string;
  };
};

const PostListing: FC<PostListingProps> = ({
  categories,
  categorySlug,
  seo,
  pageData,
  postsWithCategories,
  posts,
  variant,
  page,
}) => {
  const cardImage = {
    src: "/images/illustrations/idea-explosion.png",
    alt: "",
  };

  const categoryHeading = categories.find(
    (cat) => cat.slug === categorySlug
  )?.title;

  const postListItems = posts.map((post) =>
    "video" in post ? webinarToBlogListItem(post) : blogToBlogListItem(post)
  );

  return (
    <Layout
      seoProps={getSeoProps(seo)}
      $background="white"
      breadcrumbs={getBlogWebinarListBreadcrumbs(
        categories,
        categorySlug,
        variant.slug,
        variant.title
      )}
    >
      <MaxWidth $pt={[0, 80, 80]}>
        <SummaryCard
          {...pageData}
          heading={categoryHeading || pageData.heading}
          imageProps={cardImage}
        />
        <MobileBlogFilters
          page={page}
          categoryListProps={{
            categories,
            selectedCategorySlug: categorySlug,
          }}
        />

        <BlogWebinarsListAndCategories
          {...postsWithCategories}
          blogs={postListItems}
          page={page}
        />
      </MaxWidth>
      <BlogListJsonLd blogs={posts} />
    </Layout>
  );
};
export default PostListing;
