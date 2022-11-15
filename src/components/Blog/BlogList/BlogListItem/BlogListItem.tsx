import { FC } from "react";
import { useHover } from "react-aria";

import { BlogWebinarCategory, Image } from "../../../../common-lib/cms-types";
import Box from "../../../Box";
import useClickableCard from "../../../../hooks/useClickableCard";
import CMSImage from "../../../CMSImage";
import Flex from "../../../Flex";
import LineClamp from "../../../LineClamp";
import OakLink from "../../../OakLink";
import BoxBorders from "../../../SpriteSheet/BrushSvgs/BoxBorders";
import { P, Heading, HeadingTag } from "../../../Typography";
import AspectRatio from "../../../AspectRatio";
import OakImage from "../../../OakImage";
import { ResolveOakHrefProps } from "../../../../common-lib/urls";
import formatDate from "../../../../utils/formatDate";
import { getVideoThumbnail } from "../../../VideoPlayer/getVideoThumbnail";

type BlogListItemContentType = "blog-post" | "webinar";

const getItemLinkProps = (props: BlogListItemProps): ResolveOakHrefProps => {
  switch (props.contentType) {
    case "blog-post":
      return {
        page: "blog",
        slug: props.slug,
      };
    case "webinar":
      return {
        page: "webinars",
        slug: props.slug,
      };
  }
};
const getItemCategoryLinkProps = (
  props: BlogListItemProps
): ResolveOakHrefProps => {
  switch (props.contentType) {
    case "blog-post":
      return {
        page: "blog-index",
        category: props.category.slug,
      };
    case "webinar":
      return {
        page: "webinars-index",
        category: props.category.slug,
      };
  }
};

export type BlogListItemProps = {
  titleTag: HeadingTag;
  title: string;
  summary: string;
  slug: string;
  contentType: BlogListItemContentType;
  category: BlogWebinarCategory;
  date: string;
  withImage?: boolean;
  thumbTime?: number | null;
  mainImage?: Image | string | null;
} & (
  | { contentType: "blog-post"; mainImage?: Image | null }
  | { contentType: "webinar"; mainImage?: string | null }
);

/**
 * Contains an image, title, and text summary.
 * The component contains a link styled as a button, which
 * whose click target stretches across the entire component.
 * The title tag (h1, h2, ...) is passed as a prop.
 */
const BlogListItem: FC<BlogListItemProps> = (props) => {
  const {
    titleTag,
    title,
    summary,
    category,
    date,
    withImage,
    mainImage,
    thumbTime,
    contentType,
  } = props;

  const {
    containerProps,
    primaryTargetProps,
    isHovered: cardIsHovered,
  } = useClickableCard<HTMLAnchorElement>();
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
      {withImage && mainImage && (
        <Box
          $display={["block", "none", "block"]}
          $position={"relative"}
          $minWidth={240}
          $maxWidth={[160, "none"]}
          $mr={[0, 32]}
          $mb={[32, 0]}
        >
          <BoxBorders
            $zIndex={"inFront"}
            gapPosition={contentType === "webinar" ? undefined : "bottomRight"}
          />
          <Box $ma={1}>
            <AspectRatio ratio={"3:2"}>
              {contentType === "blog-post" ? (
                <CMSImage
                  fill
                  $objectFit="cover"
                  $objectPosition="center center"
                  image={mainImage}
                  sizes="(min-width: 750px) 256px, 100vw"
                  // Explicitly set an empty string for missing alt text in thumbnails
                  // pending a a11y decision on alt for thumbs
                  alt={mainImage.altText || ""}
                />
              ) : (
                <OakImage
                  fill
                  $objectFit="contain"
                  $objectPosition="center center"
                  $background={"black"}
                  alt={""}
                  src={getVideoThumbnail(mainImage, thumbTime)}
                />
              )}
            </AspectRatio>
          </Box>
        </Box>
      )}
      <Flex $flexDirection="column" $alignItems="flex-start" $width="100%">
        <Flex
          $width="100%"
          $alignItems={["flex-start", "flex-end"]}
          $justifyContent="space-between"
          $flexDirection={["column", "row"]}
        >
          <OakLink
            {...categoryHoverProps}
            {...getItemCategoryLinkProps(props)}
            focusStyles={["underline"]}
            $font="heading-7"
            $color="hyperlink"
          >
            {category.title}
          </OakLink>
          <P $font={"body-3"} $mt={[8, 0]}>
            {blogDate}
          </P>
        </Flex>
        <Heading tag={titleTag} $font={"heading-5"} $mt={8}>
          <OakLink
            {...primaryTargetProps}
            {...getItemLinkProps(props)}
            htmlAnchorProps={{ title }}
            focusStyles={["underline"]}
            isHovered={cardIsHovered && !categoryIsHovered}
          >
            {title}
          </OakLink>
        </Heading>
        <P $font={"body-3"} $mt={8} $mb={[8, 0]}>
          <LineClamp lines={2}>{summary}</LineClamp>
        </P>
      </Flex>
    </Flex>
  );
};

export default BlogListItem;
