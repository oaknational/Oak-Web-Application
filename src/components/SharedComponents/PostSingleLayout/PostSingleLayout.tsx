import { FC, ReactNode, useId } from "react";
import { OakGrid, OakGridArea, OakHeading } from "@oaknational/oak-components";

import PostCategoryList from "@/components/SharedComponents/PostCategoryList";
import { PostCategoryPage } from "@/components/SharedComponents/PostCategoryList/PostCategoryList";
import usePostCategoryList from "@/components/SharedComponents/PostCategoryList/usePostCategoryList";
import BlogHeader from "@/components/SharedComponents/PostHeader/PostHeader";
import { WebinarSinglePageProps } from "@/pages/webinars/[webinarSlug]";
import { BlogSinglePageProps } from "@/pages/blog/[blogSlug]";
import theme from "@/styles/theme";
import { GridArea } from "@/components/SharedComponents/Grid.deprecated";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import MobileFilters from "@/components/SharedComponents/MobileFilters";
import Breadcrumbs, {
  Breadcrumb,
} from "@/components/SharedComponents/Breadcrumbs/Breadcrumbs";
import Svg from "@/components/SharedComponents/Svg";

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
        <OakGrid $ph={["inner-padding-s", "inner-padding-none"]}>
          <OakGridArea $colSpan={[12, 0]}>
            <MobileFilters page={page} withBackButton label={"Categories"}>
              <PostCategoryList
                labelledBy={triggerId}
                $pv={28}
                $ph={16}
                categories={categories}
                page={page}
              />
            </MobileFilters>
          </OakGridArea>
          <OakGridArea
            $colSpan={[0, 12]}
            $display={["none", "flex"]}
            $flexDirection="column"
            $mv={"space-between-s"}
            $gap={"space-between-m"}
          >
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <Svg name="header-underline" $color="grey40" $height={4} />
          </OakGridArea>
          <GridArea
            $order={[0, 2]}
            $colSpan={[12, 3]}
            $mt={[48, 12]}
            $display={["none", "block"]}
            $position={[null, "sticky"]}
            $top={[null, HEADER_HEIGHT]}
          >
            <OakHeading
              tag="h3"
              $font="body-3"
              id={postCategoriesListProps.labelId}
            >
              Categories
            </OakHeading>
            <PostCategoryList
              labelledBy={postCategoriesListProps.labelId}
              $mt={24}
              categories={categories}
              page={page}
            />
          </GridArea>
          <OakGridArea $order={[0, 1]} $colSpan={[12, 2]} />
          <OakGridArea
            $order={[1, 0]}
            $colSpan={[12, 7]}
            $mt={["space-between-l", "space-between-xs"]}
          >
            <BlogHeader post={post} page={page} />
            {children}
          </OakGridArea>
        </OakGrid>
      </MaxWidth>
    </>
  );
};

export default PostSingleLayout;
