import { FC, useId } from "react";

import { TopNavProps } from "../AppComponents/TopNav/TopNav";

import { OakMaxWidth } from "@oaknational/oak-components";
import PostCategoryList, {
  PostCategoryPage,
} from "@/components/SharedComponents/PostCategoryList/PostCategoryList";
import { PostListJsonLd } from "@/browser-lib/seo/getJsonLd";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { SeoProps } from "@/browser-lib/seo/Seo";
import {
  PostListingPage,
  BlogWebinarCategory,
  SerializedBlogPostPreview,
  SerializedWebinarPreview,
} from "@/common-lib/cms-types";
import { WebinarsListingPage } from "@/common-lib/cms-types/webinarsListingPage";
import PostListAndCategories from "@/components/GenericPagesViews/PostListAndCategories.view";
import {
  CrumbPageVariant,
  getBlogWebinarListBreadcrumbs,
} from "@/components/SharedComponents/Breadcrumbs/getBreadcrumbs";
import SummaryCard from "@/components/SharedComponents/Card/SummaryCard";
import Layout from "@/components/AppComponents/Layout";
import MobileFilters from "@/components/SharedComponents/MobileFilters";
import {
  PostListingPageProps,
  blogToPostListItem,
} from "@/components/GenericPagesViews/BlogIndex.view";
import {
  WebinarListingPageProps,
  webinarToPostListItem,
} from "@/components/GenericPagesViews/WebinarsIndex.view";
import Breadcrumbs from "@/components/SharedComponents/Breadcrumbs/Breadcrumbs";

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
  topNav: TopNavProps;
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
  topNav,
}) => {
  const triggerId = useId();

  const categoryHeading = categories.find(
    (cat) => cat.slug === categorySlug,
  )?.title;

  const postListItems = posts.map((post) =>
    "video" in post ? webinarToPostListItem(post) : blogToPostListItem(post),
  );

  return (
    <Layout
      seoProps={getSeoProps(seo)}
      $background="white"
      topNavProps={topNav}
    >
      <OakMaxWidth $pt={"spacing-20"} $display={["none", "flex"]}>
        <Breadcrumbs
          breadcrumbs={getBlogWebinarListBreadcrumbs(
            categories,
            categorySlug,
            variant.slug,
            variant.title,
          )}
        />
      </OakMaxWidth>
      <OakMaxWidth
        $mb={["spacing-56", "spacing-80"]}
        $pt={["spacing-0", "spacing-24", "spacing-24"]}
      >
        <SummaryCard
          {...pageData}
          heading={categoryHeading || pageData.heading}
        />
        <MobileFilters page={page} label={"Categories"}>
          <PostCategoryList
            labelledBy={triggerId}
            $pv={"spacing-24"}
            $ph={"spacing-16"}
            categories={categories}
            selectedCategorySlug={categorySlug}
            page={page}
          />
        </MobileFilters>

        <PostListAndCategories
          {...postsWithCategories}
          blogs={postListItems}
          page={page}
          topNav={topNav}
        />
      </OakMaxWidth>
      <PostListJsonLd blogs={posts} />
    </Layout>
  );
};
export default PostListing;
