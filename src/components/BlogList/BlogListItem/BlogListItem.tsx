import { FC } from "react";

import { BlogWebinarCategory, SanityImage } from "../../../node-lib/cms";
import AspectRatio from "../../AspectRatio";
import Box from "../../Box";
import useClickableCard from "../../../hooks/useClickableCard";
import CMSImage from "../../CMSImage";
import Flex from "../../Flex";
import LineClamp from "../../LineClamp";
import OakLink from "../../OakLink";
import BoxBorders from "../../SpriteSheet/BrushSvgs/BoxBorders";
import { P, Heading, HeadingTag, Span } from "../../Typography";

type BlogListItemContentType = "blog-post" | "webinar";

export type BlogListItemProps = {
  titleTag: HeadingTag;
  title: string;
  snippet: string;
  href: string;
  contentType: BlogListItemContentType;
  category: BlogWebinarCategory;
  date: string;
  mainImage?: SanityImage | null;
  withImage?: boolean;
};

/**
 * Contains an image, title, and text snippet.
 * The component contains a link styled as a button, which
 * whose click target stretches across the entire component.
 * The title tag (h1, h2, ...) is passed as a prop.
 */
const BlogListItem: FC<BlogListItemProps> = (props) => {
  const {
    titleTag,
    title,
    snippet,
    href,
    category,
    date,
    withImage,
    mainImage,
  } = props;

  const { containerProps, primaryTargetProps } =
    useClickableCard<HTMLAnchorElement>();

  const blogDate = new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

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
          <BoxBorders $zIndex={"inFront"} gapPosition="bottomRight" />
          <Box $ma={1}>
            <AspectRatio ratio={"3:2"}>
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
          <OakLink page="blog-index" category={category.slug}>
            <Span $font="heading-7" $color="hyperlink">
              {category.title}
            </Span>
          </OakLink>
          <P $font={"body-3"} $mt={[8, 0]}>
            {blogDate}
          </P>
        </Flex>
        <Heading tag={titleTag} $font={"heading-5"} $mt={8}>
          <OakLink
            {...primaryTargetProps}
            page={null}
            href={href}
            htmlAnchorProps={{ title }}
          >
            {title}
          </OakLink>
        </Heading>
        <P $font={"body-3"} $mt={8} $mb={[8, 0]}>
          <LineClamp lines={2}>{snippet}</LineClamp>
        </P>
      </Flex>
    </Flex>
  );
};

export default BlogListItem;
