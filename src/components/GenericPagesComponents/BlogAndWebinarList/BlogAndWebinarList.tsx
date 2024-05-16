import {
  OakBox,
  OakColorToken,
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
  backgroundColor: OakColorToken;
  displayOnPhone: boolean;
};

const BlogAndWebinarList: FC<BlogAndWebinarListProps> = ({
  blogListPosts,
  showImageOnTablet,
  backgroundColor,
  displayOnPhone,
}) => {
  return (
    <OakBox
      $pa={["inner-padding-m", "inner-padding-xl"]}
      $background={backgroundColor}
      $borderRadius={"border-radius-l"}
      $mb={["space-between-m", "space-between-l"]}
      $display={displayOnPhone ? "block" : ["none", "none", "block"]}
    >
      <OakFlex
        $width={"100%"}
        $alignItems={["flex-start", "center"]}
        $justifyContent={"space-between"}
        $mb={"space-between-l"}
        $flexDirection={["column", "row"]}
      >
        <OakHeading
          tag="h2"
          $font={"heading-5"}
          $mb={["space-between-m", "space-between-none"]}
        >
          Stay up to date
        </OakHeading>
        <OakFlex $flexDirection={"row"}>
          <OakTypography $mr={"space-between-s"} $font={"heading-7"}>
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
