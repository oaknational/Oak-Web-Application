import React, { FC } from "react";
import { useTheme } from "styled-components";

import Box from "../Box";
import Grid, { GridArea } from "../Grid";
import { BlogListingPageProps } from "../pages/BlogIndex.page";
import { Heading } from "../Typography";

import BlogCategoryList from "./BlogCategoryList";
import { BlogCategoryPage } from "./BlogCategoryList/BlogCategoryList";
import useBlogCategoryList from "./BlogCategoryList/useBlogCategoryList";
import BlogList from "./BlogList";
import { BlogListItemProps } from "./BlogList/BlogListItem";

export type BlogWebinarsListAndCategoriesProps = Omit<
  BlogListingPageProps,
  "blogs"
> & { blogs: BlogListItemProps[]; page: BlogCategoryPage };

const BlogWebinarsListAndCategories: FC<BlogWebinarsListAndCategoriesProps> = (
  props
) => {
  const { blogs, categories, categorySlug, page } = props;
  const blogCategoriesListProps = useBlogCategoryList();
  const theme = useTheme();
  const HEADER_HEIGHT = theme.header.height;

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
          <BlogCategoryList
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
        <BlogList
          items={blogs}
          withContainingHrs
          withPagination
          withImage={page === "blog-index" ? false : true}
          withUpcomingItem
        />
      </GridArea>
    </Grid>
  );
};

export default BlogWebinarsListAndCategories;
