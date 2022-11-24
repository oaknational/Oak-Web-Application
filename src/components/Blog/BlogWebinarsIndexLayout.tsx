import { FC, ReactNode } from "react";

import { WebinarPageProps } from "../../pages/webinars/[webinarSlug]";
import { BlogPageProps } from "../../pages/blog/[blogSlug]";
import theme from "../../styles/theme";
import Box from "../Box";
import Grid, { GridArea } from "../Grid";
import MaxWidth from "../MaxWidth/MaxWidth";
import MobileBlogFilters from "../MobileBlogFilters";
import { Heading } from "../Typography";

import BlogCategoryList from "./BlogCategoryList";
import useBlogCategoryList from "./BlogCategoryList/useBlogCategoryList";
import BlogHeader from "./BlogHeader/BlogHeader";
import { BlogCategoryPage } from "./BlogCategoryList/BlogCategoryList";

type BlogWebinarsLayoutProps = {
  children?: ReactNode;
  content: BlogPageProps | WebinarPageProps;
};

const BlogWebinarsIndexLayout: FC<BlogWebinarsLayoutProps> = (props) => {
  const { content, children } = props;
  const { categories } = content;

  const blog = "blog" in content ? content.blog : content.webinar;
  const page: BlogCategoryPage =
    "blog" in content ? "blog-index" : "webinars-index";

  const HEADER_HEIGHT = theme.header.height;

  const blogCategoriesListProps = useBlogCategoryList();

  return (
    <>
      <MobileBlogFilters
        page={page}
        categoryListProps={{ categories }}
        withBackButton
      />
      <MaxWidth>
        <Grid $ph={[12, 0]}>
          <GridArea $order={[0, 2]} $colSpan={[12, 3]}>
            <Box
              $display={["none", "block"]}
              $position={[null, "sticky"]}
              $top={[null, HEADER_HEIGHT]}
              $pt={[48, 72]}
            >
              <Heading
                tag="h3"
                $font="body-3"
                id={blogCategoriesListProps.labelId}
              >
                Categories
              </Heading>
              <BlogCategoryList
                labelledBy={blogCategoriesListProps.labelId}
                $mt={24}
                categories={categories}
                page={page}
              />
            </Box>
          </GridArea>
          <GridArea $order={[0, 1]} $colSpan={[12, 2]} />
          <GridArea $order={[1, 0]} $colSpan={[12, 7]}>
            <BlogHeader blog={blog} page={page} />
            {children}
          </GridArea>
        </Grid>
      </MaxWidth>
    </>
  );
};

export default BlogWebinarsIndexLayout;
