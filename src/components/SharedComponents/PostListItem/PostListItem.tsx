import { FC, RefObject } from "react";
import {
  OakP,
  OakHeading,
  OakHeadingTag,
  OakFlex,
  OakBox,
  OakLink,
  OakSpan,
  OakSecondaryLink,
} from "@oaknational/oak-components";

import PostListItemImage from "./PostListItemImage";

import { BlogWebinarCategory, Image } from "@/common-lib/cms-types";
import useClickableCard from "@/hooks/useClickableCard";
import LineClamp from "@/components/SharedComponents/LineClamp";
import BoxBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BoxBorders";
import { resolveOakHref } from "@/common-lib/urls";
import formatDate from "@/utils/formatDate";
import AspectRatio from "@/components/SharedComponents/AspectRatio";

type PostListItemContentType = "blog-post" | "webinar";

const getItemLinkProps = (props: PostListItemProps): string => {
  switch (props.contentType) {
    case "blog-post":
      return resolveOakHref({
        page: "blog-single",
        blogSlug: props.slug,
      });
    case "webinar":
      return resolveOakHref({
        page: "webinar-single",
        webinarSlug: props.slug,
      });
  }
};
const getItemCategoryHref = (props: PostListItemProps): string => {
  switch (props.contentType) {
    case "blog-post":
      return resolveOakHref({
        page: "blog-index",
        categorySlug: props.category.slug,
      });
    case "webinar":
      return resolveOakHref({
        page: "webinar-index",
        categorySlug: props.category.slug,
      });
  }
};

export type PostListItemProps = {
  titleTag: OakHeadingTag;
  title: string;
  summary: string;
  slug: string;
  contentType: PostListItemContentType;
  category: BlogWebinarCategory;
  date: string;
  withImage?: boolean;
  firstItemRef?: RefObject<HTMLAnchorElement> | null;
  showImageOnTablet?: boolean;
} & (
  | { contentType: "blog-post"; mainImage?: Image | null }
  | { contentType: "webinar"; thumbnailUrl?: string | null }
);

/**
 * Contains an image, title, and text summary.
 * The component contains a link styled as a button, which
 * whose click target stretches across the entire component.
 * The title tag (h1, h2, ...) is passed as a prop.
 */
const PostListItem: FC<PostListItemProps> = (props) => {
  const {
    titleTag,
    title,
    summary,
    category,
    date,
    withImage,
    firstItemRef,
    showImageOnTablet,
  } = props;

  let imageDisplay = ["block", "none", "block"];
  if (showImageOnTablet) {
    imageDisplay = ["block", "block", "block"];
  }

  const { containerProps } = useClickableCard<HTMLAnchorElement>(firstItemRef);

  const blogDate = formatDate(date);

  return (
    <OakFlex
      {...containerProps}
      $position={"relative"}
      $flexDirection={["column", "row"]}
      $alignItems={"center"}
      $pa={"spacing-0"}
    >
      {withImage && (
        <OakBox
          $display={imageDisplay}
          $position={"relative"}
          $minWidth={"spacing-240"}
          $maxWidth={["spacing-160", "spacing-0"]}
          $mr={["spacing-0", "spacing-32"]}
          $mb={["spacing-32", "spacing-0"]}
        >
          <BoxBorders
            $zIndex={"in-front"}
            gapPosition={
              props.contentType === "webinar" ? undefined : "bottomRight"
            }
          />
          <OakBox $ma={"spacing-4"}>
            <AspectRatio ratio={"3:2"}>
              <PostListItemImage {...props} />
            </AspectRatio>
          </OakBox>
        </OakBox>
      )}
      <OakFlex $flexDirection="column" $alignItems="flex-start" $width="100%">
        <OakFlex
          $width="100%"
          $alignItems={["flex-start", "flex-end"]}
          $justifyContent="space-between"
          $flexDirection={["column", "row"]}
        >
          <OakSpan $font="heading-7" $textWrap={"nowrap"}>
            <OakLink href={getItemCategoryHref(props)}>
              {category.title}
            </OakLink>
          </OakSpan>
          <OakP $font={"body-3"} $mt={["spacing-8", "spacing-0"]}>
            {blogDate}
          </OakP>
        </OakFlex>
        <OakHeading tag={titleTag} $font={"heading-5"} $mt="spacing-8">
          <OakSecondaryLink href={getItemLinkProps(props)} title={title}>
            {title}
          </OakSecondaryLink>
        </OakHeading>
        <OakP
          $font={"body-3"}
          $mt={"spacing-8"}
          $mb={["spacing-8", "spacing-0"]}
        >
          <LineClamp lines={2}>{summary}</LineClamp>
        </OakP>
      </OakFlex>
    </OakFlex>
  );
};

export default PostListItem;
