import { FC } from "react";
import styled from "styled-components";

import Flex from "../../Flex";
import Icon from "../../Icon";
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
const BlogListItemImage = styled(Flex)`
  width: 228px;
  min-width: 228px;
  border-radius: 8px;
  margin-right: 24px;
  min-height: 120px;
`;

type BlogListItemContentType = "blog-post" | "webinar";

export type BlogListItemProps = {
  titleTag: HeadingTag;
  title: string;
  snippet: string;
  href: string;
  contentType: BlogListItemContentType;
};
/**
 * Contains an image, title, and text snippet.
 * The component contains a link styled as a button, which
 * whose click target stretches across the entire component.
 * The title tag (h1, h2, ...) is passed as a prop.
 */
const BlogListItem: FC<BlogListItemProps> = (props) => {
  const { titleTag, title, snippet, href, contentType } = props;

  return (
    <Flex
      flexDirection={["column", "row"]}
      alignItems={["flex-start", "center"]}
      position="relative"
    >
      <BlogListItemImage
        background="grey3"
        alignItems="center"
        justifyContent="center"
        mb={[24, 0]}
      >
        {contentType === "webinar" && (
          <Icon name="Play" color="white" size={48} />
        )}
      </BlogListItemImage>
      <Flex flexDirection="column" alignItems="flex-start">
        <Heading tag={titleTag} fontSize={20} mb={16}>
          <ActionLink href={href} title={title}>
            {title}
          </ActionLink>
        </Heading>
        <P fontSize={18}>
          <LineClamp lines={2}>{snippet}</LineClamp>
        </P>
      </Flex>
    </Flex>
  );
};

export default BlogListItem;
