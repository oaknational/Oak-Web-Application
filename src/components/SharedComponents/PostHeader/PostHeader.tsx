import { FC } from "react";
import {
  OakHeading,
  OakSpan,
  OakP,
  OakFlex,
} from "@oaknational/oak-components";

import { PostCategoryPage } from "@/components/SharedComponents/PostCategoryList/PostCategoryList";
import { SerializedWebinar } from "@/pages/webinars/[webinarSlug]";
import { SerializedBlog } from "@/pages/blog/[blogSlug]";
import formatDate from "@/utils/formatDate";
import AvatarImage from "@/components/SharedComponents/AvatarImage";
import Box from "@/components/SharedComponents/Box";
import CopyLinkButton from "@/components/SharedComponents/Button/CopyLinkButton";
import OwaLink from "@/components/SharedComponents/OwaLink";

type PostHeaderProps = {
  post: SerializedBlog | SerializedWebinar;
  page: PostCategoryPage;
};

const PostHeader: FC<PostHeaderProps> = ({ post, page }) => {
  const { author } = post;
  const formattedDate = formatDate(post.date);
  return (
    <>
      <OakFlex
        $justifyContent="space-between"
        $flexDirection={["column", "row"]}
      >
        <OakHeading tag={"h2"} $color="navy" $font={["heading-7"]}>
          <OwaLink page={page} categorySlug={post.category.slug}>
            {post.category.title}
          </OwaLink>
        </OakHeading>
        <OakSpan
          $font={"body-3"}
          $mt={["space-between-ssx", "space-between-none"]}
        >
          {formattedDate}
        </OakSpan>
      </OakFlex>
      <OakHeading
        $mt="space-between-xs"
        $font={["heading-5", "heading-4"]}
        tag={"h1"}
      >
        {post.title}
      </OakHeading>
      <OakFlex
        $alignItems={"center"}
        $mt="space-between-s"
        $mr={["space-between-m", "space-between-none"]}
        $justifyContent={["space-between", "left"]}
      >
        {author && (
          <OakFlex $alignItems={"center"}>
            {author.image && <AvatarImage image={author.image} $mr={12} />}
            <Box $mr={[0, 40]}>
              <OakHeading tag="h2" $font={"heading-7"}>
                {author.name}
              </OakHeading>
              {author.role && (
                <OakP
                  $mt="space-between-sssx"
                  $font={"body-3"}
                  $color={"grey60"}
                >
                  {author.role}
                </OakP>
              )}
            </Box>
          </OakFlex>
        )}
        <CopyLinkButton />
      </OakFlex>
    </>
  );
};

export default PostHeader;
