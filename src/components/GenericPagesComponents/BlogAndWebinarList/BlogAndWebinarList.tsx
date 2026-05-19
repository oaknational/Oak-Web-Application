import {
  OakBox,
  OakUiRoleToken,
  OakFlex,
  OakHeading,
  OakTypography,
  OakSecondaryLink,
} from "@oaknational/oak-components";
import { FC } from "react";

import PostList, {
  PostListProps,
} from "@/components/SharedComponents/PostList";
import { resolveOakHref } from "@/common-lib/urls";

export type BlogAndWebinarListProps = {
  blogListPosts: PostListProps;
  showImageOnTablet?: boolean;
  backgroundColor: OakUiRoleToken;
  displayOnPhone: boolean;
  isBackgroundWhite?: boolean;
  title: string;
};

const BlogAndWebinarList: FC<BlogAndWebinarListProps> = ({
  blogListPosts,
  showImageOnTablet,
  backgroundColor,
  displayOnPhone,
  isBackgroundWhite,
  title,
}) => {
  return (
    <OakBox
      $ph={["spacing-16", "spacing-24"]}
      $pv={isBackgroundWhite ? null : ["spacing-16", "spacing-24"]}
      $background={backgroundColor}
      $borderRadius={"border-radius-l"}
      $mv={["spacing-24", "spacing-56"]}
      $display={displayOnPhone ? "block" : ["none", "none", "block"]}
    >
      <OakFlex
        $width={"100%"}
        $alignItems={["flex-start", "center"]}
        $justifyContent={"space-between"}
        $mb={"spacing-48"}
        $flexDirection={["column", "row"]}
      >
        <OakHeading
          tag="h2"
          $font={"heading-5"}
          $mb={["spacing-24", "spacing-0"]}
        >
          {title}
        </OakHeading>
        <OakFlex $flexDirection={"row"}>
          <OakTypography
            $mr={"spacing-16"}
            $font={"heading-7"}
            $textWrap={"nowrap"}
          >
            <OakSecondaryLink href={resolveOakHref({ page: "webinar-index" })}>
              All webinars
            </OakSecondaryLink>
          </OakTypography>
          <OakTypography $font={"heading-7"} $textWrap={"nowrap"}>
            <OakSecondaryLink href={resolveOakHref({ page: "blog-index" })}>
              All blogs
            </OakSecondaryLink>
          </OakTypography>
        </OakFlex>
      </OakFlex>
      <PostList showImageOnTablet={showImageOnTablet} {...blogListPosts} />
    </OakBox>
  );
};

export default BlogAndWebinarList;
