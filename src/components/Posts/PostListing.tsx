import { FC } from "react";

import { getSeoProps } from "../../browser-lib/seo/getSeoProps";
import {
  BlogListingPage,
  BlogWebinarCategory,
} from "../../common-lib/cms-types";
import { WebinarsListingPage } from "../../common-lib/cms-types/webinarsListingPage";
import { BlogListItemProps } from "../Blog/BlogList/BlogListItem";
import BlogWebinarsListAndCategories, {
  BlogWebinarsListAndCategoriesProps,
} from "../Blog/BlogWebinarsListAndCategories";
import {
  CrumbPageVariant,
  getBlogWebinarListBreadcrumbs,
} from "../Breadcrumbs/getBreadcrumbs";
import SummaryCard from "../Card/SummaryCard";
import Layout from "../Layout";
import MaxWidth from "../MaxWidth/MaxWidth";
import MobileBlogFilters from "../MobileBlogFilters";
// import { BlogListJsonLd } from "../../browser-lib/seo/getJsonLd";

type PostListingProps = {
  seo: {
    title: string;
    description: string;
  };
  pageData: WebinarsListingPage | BlogListingPage;
  categories: BlogWebinarCategory[];
  categorySlug: string | null;
  postsWithCategories: BlogWebinarsListAndCategoriesProps;
  posts: BlogListItemProps[];
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
}) => {
  const cardImage = {
    src: "/images/illustrations/idea-explosion.png",
    alt: "",
  };
  return (
    <Layout
      seoProps={getSeoProps({
        title: seo.title,
        description: seo.description,
      })}
      $background="white"
      breadcrumbs={getBlogWebinarListBreadcrumbs(
        categories,
        categorySlug,
        variant.slug,
        variant.title
      )}
    >
      <MaxWidth $pt={[0, 80, 80]}>
        <SummaryCard {...pageData} imageProps={cardImage} />
        <MobileBlogFilters
          page={"blog-index"}
          categoryListProps={{
            categories,
            selectedCategorySlug: categorySlug,
          }}
        />

        <BlogWebinarsListAndCategories
          {...postsWithCategories}
          blogs={posts}
          page={"blog-index"}
        />
      </MaxWidth>
      {/* <BlogListJsonLd blogs={props.blogs} /> */}
    </Layout>
  );
};
export default PostListing;
