import { FC } from "react";
import { useHover } from "react-aria";

import { BlogWebinarCategory, Image } from "../../../../common-lib/cms-types";
import Box from "../../../Box";
import useClickableCard from "../../../../hooks/useClickableCard";
import Flex from "../../../Flex";
import LineClamp from "../../../LineClamp";
import OakLink from "../../../OakLink";
import BoxBorders from "../../../SpriteSheet/BrushSvgs/BoxBorders";
import { P, Heading, HeadingTag } from "../../../Typography";
import AspectRatio from "../../../AspectRatio";
import { ResolveOakHrefProps } from "../../../../common-lib/urls";
import formatDate from "../../../../utils/formatDate";

import PostListItemImage from "./PostListItemImage";

type PostListItemContentType = "blog-post" | "webinar";

const getItemLinkProps = (props: PostListItemProps): ResolveOakHrefProps => {
  switch (props.contentType) {
    case "blog-post":
      return {
        page: "blog-single",
        slug: props.slug,
      };
    case "webinar":
      return {
        page: "webinar-single",
        slug: props.slug,
      };
  }
};
const getItemCategoryLinkProps = (
  props: PostListItemProps
): ResolveOakHrefProps => {
  switch (props.contentType) {
    case "blog-post":
      return {
        page: "blog-index",
        category: props.category.slug,
      };
    case "webinar":
      return {
        page: "webinar-index",
        category: props.category.slug,
      };
  }
};

export type PostListItemProps = {
  titleTag: HeadingTag;
  title: string;
  summary: string;
  slug: string;
  contentType: PostListItemContentType;
  category: BlogWebinarCategory;
  date: string;
  withImage?: boolean;
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
  const { titleTag, title, summary, category, date, withImage } = props;

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
      {withImage && (
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
            gapPosition={
              props.contentType === "webinar" ? undefined : "bottomRight"
            }
          />
          <Box $ma={1}>
            <AspectRatio ratio={"3:2"}>
              <PostListItemImage {...props} />
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
            $focusStyles={["underline"]}
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
            $focusStyles={["underline"]}
            $isHovered={cardIsHovered && !categoryIsHovered}
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

export default PostListItem;
