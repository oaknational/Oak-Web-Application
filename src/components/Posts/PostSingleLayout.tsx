import { FC, ReactNode, useId } from "react";

import { WebinarSinglePageProps } from "../../pages/webinars/[webinarSlug]";
import { BlogSinglePageProps } from "../../pages/blog/[blogSlug]";
import theme from "../../styles/theme";
import Box from "../Box";
import Grid, { GridArea } from "../Grid";
import MaxWidth from "../MaxWidth/MaxWidth";
import MobileFilters from "../MobileFilters";
import { Heading } from "../Typography";

import PostCategoryList from "./PostCategoryList";
import { PostCategoryPage } from "./PostCategoryList/PostCategoryList";
import usePostCategoryList from "./PostCategoryList/usePostCategoryList";
import BlogHeader from "./PostHeader/PostHeader";

type PostSingleLayoutProps = {
  children?: ReactNode;
  content: BlogSinglePageProps | WebinarSinglePageProps;
};

const PostSingleLayout: FC<PostSingleLayoutProps> = (props) => {
  const { content, children } = props;
  const { categories } = content;
  const triggerId = useId();
  const post = "blog" in content ? content.blog : content.webinar;
  const page: PostCategoryPage =
    "blog" in content ? "blog-index" : "webinars-index";

  const HEADER_HEIGHT = theme.header.height;

  const postCategoriesListProps = usePostCategoryList();

  return (
    <>
      <MaxWidth>
        <Grid $ph={[12, 0]}>
          <GridArea $colSpan={[12]}>
            <MobileFilters page={page} withBackButton label={"Categories"}>
              <PostCategoryList
                labelledBy={triggerId}
                $pv={28}
                $ph={16}
                categories={categories}
                page={page}
              />
            </MobileFilters>
          </GridArea>
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
                id={postCategoriesListProps.labelId}
              >
                Categories
              </Heading>
              <PostCategoryList
                labelledBy={postCategoriesListProps.labelId}
                $mt={24}
                categories={categories}
                page={page}
              />
            </Box>
          </GridArea>
          <GridArea $order={[0, 1]} $colSpan={[12, 2]} />
          <GridArea $order={[1, 0]} $colSpan={[12, 7]}>
            <BlogHeader post={post} page={page} />
            {children}
          </GridArea>
        </Grid>
      </MaxWidth>
    </>
  );
};

export default PostSingleLayout;
