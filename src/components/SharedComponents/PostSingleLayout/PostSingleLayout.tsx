import { FC, ReactNode, useId } from "react";
import {
  OakGrid,
  OakGridArea,
  OakHeading,
  OakIcon,
  OakMaxWidth,
} from "@oaknational/oak-components";

import PostCategoryList from "@/components/SharedComponents/PostCategoryList";
import { PostCategoryPage } from "@/components/SharedComponents/PostCategoryList/PostCategoryList";
import usePostCategoryList from "@/components/SharedComponents/PostCategoryList/usePostCategoryList";
import BlogHeader from "@/components/SharedComponents/PostHeader/PostHeader";
import { WebinarSinglePageProps } from "@/pages/webinars/[webinarSlug]";
import { BlogSinglePageProps } from "@/pages/blog/[blogSlug]";
import theme from "@/styles/theme";
import MobileFilters from "@/components/SharedComponents/MobileFilters";
import Breadcrumbs, {
  Breadcrumb,
} from "@/components/SharedComponents/Breadcrumbs/Breadcrumbs";

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
    <OakMaxWidth>
      <OakGrid $ph={["inner-padding-s", "inner-padding-none"]}>
        <OakGridArea $colSpan={[12, 0]}>
          <MobileFilters page={page} withBackButton label={"Categories"}>
            <PostCategoryList
              labelledBy={triggerId}
              $pv={"inner-padding-xl"}
              $ph={"inner-padding-m"}
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
          <OakIcon
            iconName="header-underline"
            $colorFilter="grey40"
            $height={"all-spacing-1"}
            $width={"100%"}
            $objectFit={"fill"}
          />
        </OakGridArea>
        <OakGridArea
          $order={[0, 2]}
          $colSpan={[12, 3]}
          $mt={["space-between-l", "space-between-xs"]}
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
            $mt={"space-between-s"}
            categories={categories}
            page={page}
          />
        </OakGridArea>
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
    </OakMaxWidth>
  );
};

export default PostSingleLayout;
