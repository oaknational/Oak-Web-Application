import { FC, useId } from "react";

import PostCategoryList, {
  PostCategoryPage,
} from "./PostCategoryList/PostCategoryList";

import { PostListJsonLd } from "@/browser-lib/seo/getJsonLd";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { SeoProps } from "@/browser-lib/seo/Seo";
import { PostListingPage, BlogWebinarCategory } from "@/common-lib/cms-types";
import { WebinarsListingPage } from "@/common-lib/cms-types/webinarsListingPage";
import PostListAndCategories from "@/components/Posts/PostListAndCategories";
import {
  CrumbPageVariant,
  getBlogWebinarListBreadcrumbs,
} from "@/components/Breadcrumbs/getBreadcrumbs";
import SummaryCard from "@/components/Card/SummaryCard";
import Layout from "@/components/Layout";
import MaxWidth from "@/components/MaxWidth/MaxWidth";
import MobileFilters from "@/components/MobileFilters";
import {
  PostListingPageProps,
  blogToPostListItem,
  SerializedBlogPostPreview,
} from "@/components/pages/BlogIndex.page";
import {
  SerializedWebinarPreview,
  WebinarListingPageProps,
  webinarToPostListItem,
} from "@/components/pages/WebinarsIndex.page";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import Flex from "@/components/Flex/Flex";
import Svg from "@/components/Svg/Svg";


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
      <MaxWidth>
        <Flex
          $pt={20}
          $gap={20}
          $flexDirection="column"
          $display={["none", "block"]}
        >
          <Breadcrumbs
            breadcrumbs={getBlogWebinarListBreadcrumbs(
              categories,
              categorySlug,
              variant.slug,
              variant.title,
            )}
          />
          <Svg name="header-underline" $color="grey3" $height={4} />
        </Flex>
      </MaxWidth>
      <MaxWidth $pt={[0, 26, 26]}>
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
