import { FC } from "react";

import { SerializedWebinar } from "../../../pages/beta/webinars/[webinarSlug]";
import { SerializedBlog } from "../../../pages/blog/[blogSlug]";
import formatDate from "../../../utils/formatDate";
import AvatarImage from "../../AvatarImage";
import Box from "../../Box";
import CopyLinkButton from "../../Button/CopyLinkButton";
import Flex from "../../Flex";
import OakLink from "../../OakLink";
import { Heading, P, Span } from "../../Typography";
import { BlogCategoryPage } from "../BlogCategoryList/BlogCategoryList";

type BlogHeaderProps = {
  blog: SerializedBlog | SerializedWebinar;
  page: BlogCategoryPage;
};

const BlogHeader: FC<BlogHeaderProps> = ({ blog, page }) => {
  const { author } = blog;
  const formattedDate = formatDate(blog.date);
  return (
    <>
      <Flex
        $mt={[40, 72]}
        $justifyContent="space-between"
        $flexDirection={["column", "row"]}
      >
        <Heading tag={"h2"} $color="hyperlink" $font={["heading-7"]}>
          <OakLink page={page} category={blog.category.slug}>
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
        {author && (
          <Flex $alignItems={"center"}>
            {author.image && <AvatarImage image={author.image} $mr={12} />}
            <Box $mr={[0, 40]}>
              <Heading tag="h2" $font={"heading-7"}>
                {author.name}
              </Heading>
              {author.role && (
                <P $mt={4} $font={"body-3"} $color={"oakGrey4"}>
                  {author.role}
                </P>
              )}
            </Box>
          </Flex>
        )}
        <CopyLinkButton />
      </Flex>
    </>
  );
};

export default BlogHeader;
