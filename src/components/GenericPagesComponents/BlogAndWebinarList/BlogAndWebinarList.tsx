import {
  OakBox,
  OakUiRoleToken,
  OakFlex,
  OakHeading,
  OakTypography,
} from "@oaknational/oak-components";
import { FC } from "react";

import OwaLink from "@/components/SharedComponents/OwaLink";
import PostList, {
  PostListProps,
} from "@/components/SharedComponents/PostList";

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
          <OakTypography $mr={"spacing-16"} $font={"heading-7"}>
            <OwaLink page={"webinar-index"}>All webinars</OwaLink>
          </OakTypography>
          <OakTypography $font={"heading-7"}>
            <OwaLink page={"blog-index"}>All blogs</OwaLink>
          </OakTypography>
        </OakFlex>
      </OakFlex>
      <PostList showImageOnTablet={showImageOnTablet} {...blogListPosts} />
    </OakBox>
  );
};

export default BlogAndWebinarList;
