import React, { FC } from "react";
import {
  OakGrid,
  OakGridArea,
  OakHeading,
  OakBox,
} from "@oaknational/oak-components";

import { PostListingPageProps } from "@/components/GenericPagesViews/BlogIndex.view";
import { PostListItemProps } from "@/components/SharedComponents/PostListItem";
import PostCategoryList from "@/components/SharedComponents/PostCategoryList";
import {
  CATEGORY_NAV_LABEL,
  PostCategoryPage,
} from "@/components/SharedComponents/PostCategoryList/PostCategoryList";
import PostList from "@/components/SharedComponents/PostList";
import usePostList from "@/components/SharedComponents/PostList/usePostList";

export type PostListAndCategoriesProps = Omit<PostListingPageProps, "blogs"> & {
  blogs: PostListItemProps[];
  page: PostCategoryPage;
};

const PostListAndCategories: FC<PostListAndCategoriesProps> = (props) => {
  const { blogs, categories, categorySlug, page } = props;
  const blogListProps = usePostList({
    items: blogs,
    withImage: page === "blog-index" ? false : true,
    withContainingHrs: true,
    withPagination: true,
    withUpcomingItem: true,
  });

  return (
    <OakGrid $ph={["spacing-12", "spacing-0"]}>
      <OakGridArea $order={[0, 2]} $colSpan={[12, 4, 3]}>
        <OakBox
          $display={["none", "block"]}
          $position={[null, "sticky"]}
          $top={[null, "spacing-72"]}
          $mt={["spacing-0", "spacing-24"]}
          $pt={["spacing-48"]}
        >
          <OakHeading tag="h3" $font="body-3">
            {CATEGORY_NAV_LABEL}
          </OakHeading>
          <PostCategoryList
            $mt={"spacing-24"}
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
        $mt={["spacing-16", "spacing-72"]}
      >
        <PostList {...blogListProps} />
      </OakGridArea>
    </OakGrid>
  );
};

export default PostListAndCategories;
