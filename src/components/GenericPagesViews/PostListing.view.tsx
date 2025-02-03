import { FC, useId } from "react";
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

  const categoryHeading = categories.find(
    (cat) => cat.slug === categorySlug,
  )?.title;

  const postListItems = posts.map((post) =>
    "video" in post ? webinarToPostListItem(post) : blogToPostListItem(post),
  );

  return (
    <Layout seoProps={getSeoProps(seo)} $background="white">
      <OakMaxWidth $pt={"inner-padding-l"} $display={["none", "flex"]}>
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
        $mb={["space-between-xl", "space-between-xxxl"]}
        $pt={["inner-padding-none", "inner-padding-xl", "inner-padding-xl"]}
      >
        <SummaryCard
          {...pageData}
          heading={categoryHeading || pageData.heading}
        />
        <MobileFilters page={page} label={"Categories"}>
          <PostCategoryList
            labelledBy={triggerId}
            $pv={"inner-padding-xl"}
            $ph={"inner-padding-m"}
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
      </OakMaxWidth>
      <PostListJsonLd blogs={posts} />
    </Layout>
  );
};
export default PostListing;
