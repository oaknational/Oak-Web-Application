import { FC } from "react";
import styled from "styled-components";

import { BlogWebinarCategory, SanityImage } from "../../../node-lib/cms";
import AspectRatio from "../../AspectRatio";
import Box from "../../Box";
import CMSImage from "../../CMSImage";
import Flex from "../../Flex";
import LineClamp from "../../LineClamp";
import { P, Heading, HeadingTag } from "../../Typography";

const ActionLink = styled.a`
  ::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
`;

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

  const blogDate = new Date(date);

  return (
    <Flex $position={"relative"} $mt={24} $flexDirection={["column", "row"]}>
      {withImage && mainImage && (
        <Box $position={"relative"} $minWidth={240}>
          <AspectRatio ratio={"3:2"}>
            <CMSImage
              layout="fill"
              objectFit="cover"
              objectPosition="center center"
              image={mainImage}
            />
          </AspectRatio>
        </Box>
      )}
      <Flex $flexDirection="column" $alignItems="flex-start" $ml={[0, 32]}>
        <P
          $fontSize={16}
          $lineHeight={"20px"}
          // Not blue until link to category filter is added
          // $color="teachersHighlight"
          $fontFamily="ui"
        >
          {category.title}
        </P>
        <P $fontSize={14} $lineHeight={"20px"} $mt={16}>
          {blogDate.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </P>
        <Heading tag={titleTag} $fontSize={20} $mt={8}>
          <ActionLink href={href} title={title}>
            {title}
          </ActionLink>
        </Heading>
        <P $fontSize={18} $mt={8}>
          <LineClamp lines={2}>{snippet}</LineClamp>
        </P>
      </Flex>
    </Flex>
  );
};

export default BlogListItem;
