import { FC, ReactNode } from "react";
import styled from "styled-components";

import Flex from "../Flex";
import Icon from "../Icon";
import { Heading, HeadingTag } from "../Typography";
import Hr from "../Typography/Hr";

import BlogListItem, { BlogListItemProps } from "./BlogListItem";

const BlogListContainer = styled.div``;

type BlogListProps = {
  children: ReactNode;
  title: string;
  titleTag: HeadingTag;
  items: BlogListItemProps[];
};
const BlogList: FC<BlogListProps> = (props) => {
  const { title, titleTag, items } = props;
  return (
    <BlogListContainer>
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
    </BlogListContainer>
  );
};

export default BlogList;
