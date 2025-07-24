import { FC, RefObject } from "react";
import { useHover } from "react-aria";
import {
  OakP,
  OakHeading,
  OakHeadingTag,
  OakFlex,
  OakBox,
} from "@oaknational/oak-components";

import PostListItemImage from "./PostListItemImage";

import { BlogWebinarCategory, Image } from "@/common-lib/cms-types";
import useClickableCard from "@/hooks/useClickableCard";
import LineClamp from "@/components/SharedComponents/LineClamp";
import OwaLink from "@/components/SharedComponents/OwaLink";
import BoxBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BoxBorders";
import { ResolveOakHrefProps } from "@/common-lib/urls";
import formatDate from "@/utils/formatDate";
import AspectRatio from "@/components/SharedComponents/AspectRatio";
import Flex from "@/components/SharedComponents/Flex.deprecated";

type PostListItemContentType = "blog-post" | "webinar";

const getItemLinkProps = (props: PostListItemProps): ResolveOakHrefProps => {
  switch (props.contentType) {
    case "blog-post":
      return {
        page: "blog-single",
        blogSlug: props.slug,
      };
    case "webinar":
      return {
        page: "webinar-single",
        webinarSlug: props.slug,
      };
  }
};
const getItemCategoryLinkProps = (
  props: PostListItemProps,
): ResolveOakHrefProps => {
  switch (props.contentType) {
    case "blog-post":
      return {
        page: "blog-index",
        categorySlug: props.category.slug,
      };
    case "webinar":
      return {
        page: "webinar-index",
        categorySlug: props.category.slug,
      };
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

  const {
    containerProps,
    primaryTargetProps,
    isHovered: cardIsHovered,
  } = useClickableCard<HTMLAnchorElement>(firstItemRef);
  const { hoverProps: categoryHoverProps, isHovered: categoryIsHovered } =
    useHover({});

  const blogDate = formatDate(date);

  return (
    <Flex
      {...containerProps}
      $position={"relative"}
      $flexDirection={["column", "row"]}
      $alignItems={"center"}
      $pa={0}
    >
      {withImage && (
        <OakBox
          $display={imageDisplay}
          $position={"relative"}
          $minWidth={"all-spacing-19"}
          $maxWidth={["all-spacing-17", "all-spacing-0"]}
          $mr={["space-between-none", "space-between-m2"]}
          $mb={["space-between-m2", "space-between-none"]}
        >
          <BoxBorders
            $zIndex={"in-front"}
            gapPosition={
              props.contentType === "webinar" ? undefined : "bottomRight"
            }
          />
          <OakBox $ma={"space-between-sssx"}>
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
          <OwaLink
            {...categoryHoverProps}
            {...getItemCategoryLinkProps(props)}
            $focusStyles={["underline"]}
            $font="heading-7"
            $color="navy"
          >
            {category.title}
          </OwaLink>
          <OakP
            $font={"body-3"}
            $mt={["space-between-ssx", "space-between-none"]}
          >
            {blogDate}
          </OakP>
        </OakFlex>
        <OakHeading tag={titleTag} $font={"heading-5"} $mt="space-between-ssx">
          <OwaLink
            {...primaryTargetProps}
            {...getItemLinkProps(props)}
            htmlAnchorProps={{ title }}
            $focusStyles={["underline"]}
            $isHovered={cardIsHovered && !categoryIsHovered}
          >
            {title}
          </OwaLink>
        </OakHeading>
        <OakP
          $font={"body-3"}
          $mt={"space-between-ssx"}
          $mb={["space-between-ssx", "space-between-none"]}
        >
          <LineClamp lines={2}>{summary}</LineClamp>
        </OakP>
      </OakFlex>
    </Flex>
  );
};

export default PostListItem;
