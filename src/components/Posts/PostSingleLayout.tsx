import { FC, ReactNode, useId } from "react";

import PostCategoryList from "./PostCategoryList";
import { PostCategoryPage } from "./PostCategoryList/PostCategoryList";
import usePostCategoryList from "./PostCategoryList/usePostCategoryList";
import BlogHeader from "./PostHeader/PostHeader";

import { WebinarSinglePageProps } from "@/pages/webinars/[webinarSlug]";
import { BlogSinglePageProps } from "@/pages/blog/[blogSlug]";
import theme from "@/styles/theme";
import Grid, { GridArea } from "@/components/Grid";
import MaxWidth from "@/components/MaxWidth/MaxWidth";
import MobileFilters from "@/components/MobileFilters";
import { Heading } from "@/components/Typography";
import Breadcrumbs, { Breadcrumb } from "@/components/Breadcrumbs/Breadcrumbs";
import Svg from "@/components/Svg/Svg";

type PostSingleLayoutProps = {
  children?: ReactNode;
  content: BlogSinglePageProps | WebinarSinglePageProps;
  breadcrumbs: Breadcrumb[];
};

const PostSingleLayout: FC<PostSingleLayoutProps> = (props) => {
  const { content, children, breadcrumbs } = props;
  const { categories } = content;
  const triggerId = useId();
  const post = "blog" in content ? content.blog : content.webinar;
  const page: PostCategoryPage =
    "blog" in content ? "blog-index" : "webinar-index";

  const HEADER_HEIGHT = theme.header.height;

  const postCategoriesListProps = usePostCategoryList();

  return (
    <>
      <MaxWidth>
        <Grid $ph={[12, 0]}>
          <GridArea $colSpan={[12, 0]}>
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
          <GridArea
            $colSpan={[0, 12]}
            $display={["none", "flex"]}
            $flexDirection="column"
            $mv={20}
            $gap={20}
          >
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <Svg name="header-underline" $color="grey3" $height={4} />
          </GridArea>
          <GridArea
            $order={[0, 2]}
            $colSpan={[12, 3]}
            $mt={[48, 12]}
            $display={["none", "block"]}
            $position={[null, "sticky"]}
            $top={[null, HEADER_HEIGHT]}
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
          </GridArea>
          <GridArea $order={[0, 1]} $colSpan={[12, 2]} />
          <GridArea $order={[1, 0]} $colSpan={[12, 7]} $mt={[40, 12]}>
            <BlogHeader post={post} page={page} />
            {children}
          </GridArea>
        </Grid>
      </MaxWidth>
    </>
  );
};

export default PostSingleLayout;
