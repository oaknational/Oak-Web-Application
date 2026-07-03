import { FC, ReactNode } from "react";
import {
  OakGrid,
  OakGridArea,
  OakHeading,
  OakIcon,
  OakMaxWidth,
} from "@oaknational/oak-components";

import PostCategoryList from "@/components/SharedComponents/PostCategoryList";
import {
  CATEGORY_NAV_LABEL,
  PostCategoryPage,
} from "@/components/SharedComponents/PostCategoryList/PostCategoryList";
import BlogHeader from "@/components/SharedComponents/PostHeader/PostHeader";
import { WebinarSinglePageProps } from "@/pages/webinars/[webinarSlug]";
import { BlogSinglePageProps } from "@/pages/blog/[blogSlug]";
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
  const post = "blog" in content ? content.blog : content.webinar;
  const page: PostCategoryPage =
    "blog" in content ? "blog-index" : "webinar-index";

  return (
    <OakMaxWidth>
      <OakGrid $ph={["spacing-12", "spacing-0"]}>
        <OakGridArea $colSpan={[12, 0]} $mt={"spacing-24"}>
          <MobileFilters page={page} withBackButton label={CATEGORY_NAV_LABEL}>
            <PostCategoryList
              $pv={"spacing-24"}
              $ph={"spacing-16"}
              categories={categories}
              page={page}
            />
          </MobileFilters>
        </OakGridArea>
        <OakGridArea
          $colSpan={[0, 12]}
          $display={["none", "flex"]}
          $flexDirection="column"
          $mv={"spacing-16"}
          $gap={"spacing-24"}
        >
          <Breadcrumbs breadcrumbs={breadcrumbs} />
          <OakIcon
            iconName="header-underline"
            $colorFilter="bg-interactive-element2"
            $height={"spacing-4"}
            $width={"100%"}
            $objectFit={"fill"}
          />
        </OakGridArea>
        <OakGridArea
          $order={[0, 2]}
          $colSpan={[12, 3]}
          $mt={["spacing-48", "spacing-12"]}
          $display={["none", "block"]}
          $top={[null, "spacing-72"]}
          $position={[null, "sticky"]}
        >
          <OakHeading tag="h3" $font="body-3">
            {CATEGORY_NAV_LABEL}
          </OakHeading>
          <PostCategoryList
            $mt={"spacing-16"}
            categories={categories}
            page={page}
          />
        </OakGridArea>
        <OakGridArea $order={[0, 1]} $colSpan={[12, 2]} />
        <OakGridArea
          $order={[1, 0]}
          $colSpan={[12, 7]}
          $mt={["spacing-48", "spacing-12"]}
        >
          <BlogHeader post={post} page={page} />
          {children}
        </OakGridArea>
      </OakGrid>
    </OakMaxWidth>
  );
};

export default PostSingleLayout;
