import { FC } from "react";
import styled from "styled-components";

import getColor from "../../../styles/themeHelpers/getColor";
import ButtonAsLink from "../../Button/ButtonAsLink";
import Flex from "../../Flex";
import { Text, Heading, HeadingTag } from "../../Typography";

const ActionButton = styled(ButtonAsLink)`
  ::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
`;
const BlogListItemImage = styled.div`
  width: 228px;
  min-width: 228px;
  border-radius: 8px;
  background-color: ${getColor("grey3")};
  margin-right: 24px;
`;

type BlogListItemContentType = "blog-post" | "webinar";

const buttonLabelMap: Record<BlogListItemContentType, string> = {
  "blog-post": "Watch Now",
  webinar: "Read More",
};

export type BlogListItemProps = {
  titleTag: HeadingTag;
  title: string;
  snippet: string;
  href: string;
  contentType: BlogListItemContentType;
};
const BlogListItem: FC<BlogListItemProps> = (props) => {
  const { titleTag, title, snippet, href, contentType } = props;

  return (
    <Flex position="relative">
      <BlogListItemImage />
      <Flex flexDirection="column" alignItems="flex-start">
        <Heading tag={titleTag} size={20} mb={16}>
          {title}
        </Heading>
        <Text size={18} color="grey6" lineClamp={2}>
          {snippet}
        </Text>
        <ActionButton
          href={href}
          label={buttonLabelMap[contentType]}
          mt={16}
          variant="secondary"
        />
      </Flex>
    </Flex>
  );
};

export default BlogListItem;
