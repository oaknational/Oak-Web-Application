import Link from "next/link";
import { FC, Fragment } from "react";

import CardTitle from "../Card/CardComponents/CardTitle";
import Flex from "../Flex";
import { P } from "../Typography";
import { HeadingTag } from "../Typography/Heading";
import Hr from "../Typography/Hr";

import BlogListItem, { BlogListItemProps } from "./BlogListItem";

export type BlogListProps = {
  title: string;
  titleTag: HeadingTag;
  items: BlogListItemProps[];
};
/**
 * Contains a title of set size and a list of BlogListItem,
 * with dividers between them.
 * The title tag (h1, h2, ...) is passed as a prop.
 */
const BlogList: FC<BlogListProps> = (props) => {
  const { title, titleTag, items } = props;
  return (
    <Flex $flexDirection="column">
      <Flex
        $mb={24}
        $flexDirection={["column", "row", "row"]}
        $alignItems={["flex-start", "flex-start", "center"]}
        $justifyContent={"space-between"}
      >
        <Flex $mb={[24, 0]} $flexDirection={"row"} $alignItems={"center"}>
          <CardTitle icon={"HandHoldingPaper"} iconSize={40} tag={titleTag}>
            {title}
          </CardTitle>
        </Flex>
        <Flex $justifyContent={"space-between"}>
          <nav>
            <Flex $justifyContent={"center"} $alignItems="center">
              <P $mr={16}>
                <Link href="/">All Webinars</Link>
              </P>
              <P>
                <Link href="/">All Blogs</Link>
              </P>
            </Flex>
          </nav>
        </Flex>
      </Flex>
      {items.map((item, i) => (
        <Fragment key={`BlogList-BlogListItem-${i}`}>
          <BlogListItem {...item} />
          {i < items.length - 1 && <Hr />}
        </Fragment>
      ))}
    </Flex>
  );
};

export default BlogList;
