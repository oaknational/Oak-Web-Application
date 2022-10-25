import { FC } from "react";

import { BlogPageProps } from "../../../pages/blog/[blogSlug]";
import AvatarImage from "../../AvatarImage";
import Box from "../../Box";
import CopyLinkButton from "../../Button/CopyLinkButton";
import Flex from "../../Flex";
import OakLink from "../../OakLink";
import { Heading, P, Span } from "../../Typography";

type BlogHeaderProps = Pick<BlogPageProps, "blog">;

const BlogHeader: FC<BlogHeaderProps> = ({ blog }) => {
  const formattedDate = new Date(blog.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <>
      <Flex
        $mt={[40, 72]}
        $justifyContent="space-between"
        $flexDirection={["column", "row"]}
      >
        <Heading tag={"h2"} $color="hyperlink" $font={["heading-7"]}>
          <OakLink page="blog-index" category={blog.category.slug}>
            {blog.category.title}
          </OakLink>
        </Heading>
        <Span $font={"body-3"} $mt={[8, 0]}>
          {formattedDate}
        </Span>
      </Flex>
      <Heading $mt={12} $font={["heading-5", "heading-4"]} tag={"h1"}>
        {blog.title}
      </Heading>
      <Flex
        $alignItems={"center"}
        $mt={16}
        $mr={[20, 0]}
        $justifyContent={["space-between", "left"]}
      >
        <Flex $alignItems={"center"}>
          {blog.author.image && (
            <AvatarImage image={blog.author.image} $mr={12} />
          )}
          <Box $mr={[0, 40]}>
            <Heading tag="h2" $font={"heading-7"}>
              {blog.author.name}
            </Heading>
            {blog.author.role && (
              <P $mt={4} $font={"body-3"} $color={"oakGrey4"}>
                {blog.author.role}
              </P>
            )}
          </Box>
        </Flex>
        <CopyLinkButton />
      </Flex>
    </>
  );
};

export default BlogHeader;
