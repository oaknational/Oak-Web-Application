import { FC } from "react";
import {
  OakHeading,
  OakSpan,
  OakP,
  OakFlex,
  OakLink,
} from "@oaknational/oak-components";

import CMSImage from "../CMSImage";

import { PostCategoryPage } from "@/components/SharedComponents/PostCategoryList/PostCategoryList";
import { SerializedWebinar } from "@/pages/webinars/[webinarSlug]";
import { SerializedBlog } from "@/pages/blog/[blogSlug]";
import formatDate from "@/utils/formatDate";
import Box from "@/components/SharedComponents/Box";
import CopyLinkButton from "@/components/SharedComponents/Button/CopyLinkButton";
import { resolveOakHref } from "@/common-lib/urls";

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
        <OakHeading
          tag={"h2"}
          $color="text-link-active"
          $font={["heading-7"]}
          $textWrap={"nowrap"}
        >
          <OakLink
            href={resolveOakHref({ page, categorySlug: post.category.slug })}
          >
            {post.category.title}
          </OakLink>
        </OakHeading>
        <OakSpan $font={"body-3"} $mt={["spacing-8", "spacing-0"]}>
          {formattedDate}
        </OakSpan>
      </OakFlex>
      <OakHeading
        $mt="spacing-12"
        $font={["heading-5", "heading-4"]}
        tag={"h1"}
      >
        {post.title}
      </OakHeading>
      <OakFlex
        $alignItems={"center"}
        $mt="spacing-16"
        $mr={["spacing-24", "spacing-0"]}
        $justifyContent={["space-between", "left"]}
      >
        {author && (
          <OakFlex $alignItems={"center"}>
            {author.image && (
              <OakFlex
                $overflow={"hidden"}
                $width={"spacing-56"}
                $height={"spacing-56"}
                $position={"relative"}
                $borderRadius="border-radius-circle"
                $justifyContent={"center"}
                $alignItems={"center"}
                $mr={"spacing-12"}
              >
                <CMSImage
                  image={author.image}
                  $objectFit={"cover"}
                  width={56}
                  height={56}
                />
              </OakFlex>
            )}
            <Box $mr={[0, 40]}>
              <OakHeading tag="h2" $font={"heading-7"}>
                {author.name}
              </OakHeading>
              {author.role && (
                <OakP $mt="spacing-4" $font={"body-3"} $color={"text-subdued"}>
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
