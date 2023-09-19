import { FC, useId } from "react";

import { PostListJsonLd } from "../../browser-lib/seo/getJsonLd";
import { getSeoProps } from "../../browser-lib/seo/getSeoProps";
import { SeoProps } from "../../browser-lib/seo/Seo";
import {
  PostListingPage,
  BlogWebinarCategory,
} from "../../common-lib/cms-types";
import { WebinarsListingPage } from "../../common-lib/cms-types/webinarsListingPage";
import PostListAndCategories from "../Posts/PostListAndCategories";
import {
  CrumbPageVariant,
  getBlogWebinarListBreadcrumbs,
} from "../Breadcrumbs/getBreadcrumbs";
import SummaryCard from "../Card/SummaryCard";
import Layout from "../Layout";
import MaxWidth from "../MaxWidth/MaxWidth";
import MobileFilters from "../MobileFilters";
import {
  PostListingPageProps,
  blogToPostListItem,
  SerializedBlogPostPreview,
} from "../pages/BlogIndex.page";
import {
  SerializedWebinarPreview,
  WebinarListingPageProps,
  webinarToPostListItem,
} from "../pages/WebinarsIndex.page";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";

import PostCategoryList, {
  PostCategoryPage,
} from "./PostCategoryList/PostCategoryList";

type PostListingProps = {
  seo: SeoProps;
  pageData: WebinarsListingPage | PostListingPage;
  categories: BlogWebinarCategory[];
  categorySlug: string | null;
  postsWithCategories: WebinarListingPageProps | PostListingPageProps;
  posts: SerializedBlogPostPreview[] | SerializedWebinarPreview[];
  page: PostCategoryPage;
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
  const triggerId = useId();

  const categoryHeading = categories.find((cat) => cat.slug === categorySlug)
    ?.title;

  const postListItems = posts.map((post) =>
    "video" in post ? webinarToPostListItem(post) : blogToPostListItem(post),
  );

  return (
    <Layout seoProps={getSeoProps(seo)} $background="white">
      <Breadcrumbs
        breadcrumbs={getBlogWebinarListBreadcrumbs(
          categories,
          categorySlug,
          variant.slug,
          variant.title,
        )}
      />
      <MaxWidth $pt={[0, 80, 80]}>
        <SummaryCard
          {...pageData}
          heading={categoryHeading || pageData.heading}
        />
        <MobileFilters page={page} label={"Categories"}>
          <PostCategoryList
            labelledBy={triggerId}
            $pv={28}
            $ph={16}
            categories={categories}
            selectedCategorySlug={categorySlug}
            page={page}
          />
        </MobileFilters>

        <PostListAndCategories
          {...postsWithCategories}
          blogs={postListItems}
          page={page}
        />
      </MaxWidth>
      <PostListJsonLd blogs={posts} />
    </Layout>
  );
};
export default PostListing;
