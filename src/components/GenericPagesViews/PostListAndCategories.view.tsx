import React, { FC } from "react";
import {
  OakBox,
  OakGrid,
  OakGridArea,
  OakHeading,
} from "@oaknational/oak-components";

import { PostListingPageProps } from "@/components/GenericPagesViews/BlogIndex.view";
import { PostListItemProps } from "@/components/SharedComponents/PostListItem";
import PostCategoryList from "@/components/SharedComponents/PostCategoryList";
import { PostCategoryPage } from "@/components/SharedComponents/PostCategoryList/PostCategoryList";
import usePostCategoryList from "@/components/SharedComponents/PostCategoryList/usePostCategoryList";
import PostList from "@/components/SharedComponents/PostList";
import usePostList from "@/components/SharedComponents/PostList/usePostList";

export type PostListAndCategoriesProps = Omit<PostListingPageProps, "blogs"> & {
  blogs: PostListItemProps[];
  page: PostCategoryPage;
};

const PostListAndCategories: FC<PostListAndCategoriesProps> = (props) => {
  const { blogs, categories, categorySlug, page } = props;
  const blogCategoriesListProps = usePostCategoryList();
  const blogListProps = usePostList({
    items: blogs,
    withImage: page === "blog-index" ? false : true,
    withContainingHrs: true,
    withPagination: true,
    withUpcomingItem: true,
  });

  return (
    <OakGrid $ph={["inner-padding-s", "inner-padding-none"]}>
      <OakGridArea $order={[0, 2]} $colSpan={[12, 4, 3]}>
        <OakBox
          $display={["none", "block"]}
          $position={[null, "sticky"]}
          $top={[null, "all-spacing-12"]}
          $mt={["space-between-none", "space-between-m"]}
          $pt={["inner-padding-xl4"]}
          as="aside"
        >
          <OakHeading
            tag="h3"
            $font="body-3"
            id={blogCategoriesListProps.labelId}
          >
            Categories
          </OakHeading>
          <PostCategoryList
            labelledBy={blogCategoriesListProps.labelId}
            $mt={24}
            categories={categories}
            selectedCategorySlug={categorySlug}
            page={page}
          />
        </OakBox>
      </OakGridArea>
      {/* @todo is there a nicer way to make this 1 column spacer? */}
      <OakGridArea $order={1} $colSpan={[12, 1]} />
      <OakGridArea
        $order={[1, 0]}
        $colSpan={[12, 7, 8]}
        $mt={["space-between-s", "space-between-xxl"]}
      >
        <PostList {...blogListProps} />
      </OakGridArea>
    </OakGrid>
  );
};

export default PostListAndCategories;
