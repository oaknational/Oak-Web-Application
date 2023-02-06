import React, { FC } from "react";
import { useTheme } from "styled-components";

import Box from "../Box";
import Grid, { GridArea } from "../Grid";
import { PostListingPageProps } from "../pages/BlogIndex.page";
import { Heading } from "../Typography";

import PostCategoryList from "./PostCategoryList";
import { PostCategoryPage } from "./PostCategoryList/PostCategoryList";
import usePostCategoryList from "./PostCategoryList/usePostCategoryList";
import PostList from "./PostList";
import { PostListItemProps } from "./PostList/PostListItem";
import usePostList from "./PostList/usePostList";

export type PostListAndCategoriesProps = Omit<PostListingPageProps, "blogs"> & {
  blogs: PostListItemProps[];
  page: PostCategoryPage;
};

const PostListAndCategories: FC<PostListAndCategoriesProps> = (props) => {
  const { blogs, categories, categorySlug, page } = props;
  const blogCategoriesListProps = usePostCategoryList();
  const theme = useTheme();
  const HEADER_HEIGHT = theme.header.height;
  const blogListProps = usePostList({
    items: blogs,
    withImage: page === "blog-index" ? false : true,
    withContainingHrs: true,
    withPagination: true,
    withUpcomingItem: true,
  });

  return (
    <Grid $ph={[12, 0]}>
      <GridArea $order={[0, 2]} $colSpan={[12, 4, 3]}>
        <Box
          $display={["none", "block"]}
          $position={[null, "sticky"]}
          $top={[null, HEADER_HEIGHT]}
          $mt={[0, 24]}
          $pt={[48]}
        >
          <Heading tag="h3" $font="body-3" id={blogCategoriesListProps.labelId}>
            Categories
          </Heading>
          <PostCategoryList
            labelledBy={blogCategoriesListProps.labelId}
            $mt={24}
            categories={categories}
            selectedCategorySlug={categorySlug}
            page={page}
          />
        </Box>
      </GridArea>
      {/* @todo is there a nicer way to make this 1 column spacer? */}
      <GridArea $order={1} $colSpan={[12, 1]} />
      <GridArea $order={[1, 0]} $colSpan={[12, 7, 8]} $mt={[16, 72]}>
        <PostList {...blogListProps} />
      </GridArea>
    </Grid>
  );
};

export default PostListAndCategories;
