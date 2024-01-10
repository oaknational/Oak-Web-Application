import { FC, useId } from "react";

import PostCategoryList, {
  PostCategoryPage,
} from "@/components/SharedComponents/PostCategoryList/PostCategoryList";
import { PostListJsonLd } from "@/browser-lib/seo/getJsonLd";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { SeoProps } from "@/browser-lib/seo/Seo";
import { PostListingPage, BlogWebinarCategory } from "@/common-lib/cms-types";
import { WebinarsListingPage } from "@/common-lib/cms-types/webinarsListingPage";
import PostListAndCategories from "@/components/GenericPagesViews/PostListAndCategories.view";
import {
  CrumbPageVariant,
  getBlogWebinarListBreadcrumbs,
} from "@/components/SharedComponents/Breadcrumbs/getBreadcrumbs";
import SummaryCard from "@/components/SharedComponents/Card/SummaryCard";
import Layout from "@/components/SharedComponents/Layout";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import MobileFilters from "@/components/MobileFilters";
import {
  PostListingPageProps,
  blogToPostListItem,
  SerializedBlogPostPreview,
} from "@/components/GenericPagesViews/BlogIndex.view";
import {
  SerializedWebinarPreview,
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

  const categoryHeading = categories.find((cat) => cat.slug === categorySlug)
    ?.title;

  const postListItems = posts.map((post) =>
    "video" in post ? webinarToPostListItem(post) : blogToPostListItem(post),
  );

  return (
    <Layout seoProps={getSeoProps(seo)} $background="white">
      <MaxWidth $pt={20} $display={["none", "flex"]}>
        <Breadcrumbs
          breadcrumbs={getBlogWebinarListBreadcrumbs(
            categories,
            categorySlug,
            variant.slug,
            variant.title,
          )}
        />
      </MaxWidth>
      <MaxWidth $mb={[56, 80]} $pt={[0, 26, 26]}>
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
