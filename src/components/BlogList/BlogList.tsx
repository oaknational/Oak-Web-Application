import { FC, ReactNode } from "react";

import Flex from "../Flex";
import Icon from "../Icon";
import { Heading, HeadingTag } from "../Typography";
import Hr from "../Typography/Hr";

import BlogListItem, { BlogListItemProps } from "./BlogListItem";

type BlogListProps = {
  children: ReactNode;
  title: string;
  titleTag: HeadingTag;
  items: BlogListItemProps[];
};
/**
 * Contains a title of set size and a list of BlogListItem,
 * with dividers between them.
 * The title tag (h1, h2, ...) is passed as a prop.
 *
 */
const BlogList: FC<BlogListProps> = (props) => {
  const { title, titleTag, items } = props;
  return (
    <Flex flexDirection="column">
      <Flex mb={24} alignItems="center">
        <Icon name="Newspaper" mr={16} size={36} />
        <Heading size={24} tag={titleTag}>
          {title}
        </Heading>
      </Flex>
      {items.map((item, i) => (
        <>
          <BlogListItem key={`BlogList-BlogListItem-${item.href}`} {...item} />
          {i < items.length - 1 && <Hr />}
        </>
      ))}
    </Flex>
  );
};

export default BlogList;
