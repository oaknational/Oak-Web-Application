import { FC } from "react";
import styled from "styled-components";

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
  category: string;
};

/**
 * Contains an image, title, and text snippet.
 * The component contains a link styled as a button, which
 * whose click target stretches across the entire component.
 * The title tag (h1, h2, ...) is passed as a prop.
 */
const BlogListItem: FC<BlogListItemProps> = (props) => {
  const { titleTag, title, snippet, href, category } = props;

  return (
    <Flex $flexDirection="column" $alignItems="flex-start">
      <Heading tag={titleTag} $fontSize={20} $mb={16}>
        <ActionLink href={href} title={title}>
          {title} | {category}
        </ActionLink>
      </Heading>
      <P $fontSize={18}>
        <LineClamp lines={2}>{snippet}</LineClamp>
      </P>
    </Flex>
  );
};

export default BlogListItem;
