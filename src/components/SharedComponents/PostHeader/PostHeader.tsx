import { FC } from "react";

import { PostCategoryPage } from "@/components/SharedComponents/PostCategoryList/PostCategoryList";
import { SerializedWebinar } from "@/pages/webinars/[webinarSlug]";
import { SerializedBlog } from "@/pages/blog/[blogSlug]";
import formatDate from "@/utils/formatDate";
import AvatarImage from "@/components/SharedComponents/AvatarImage";
import Box from "@/components/SharedComponents/Box";
import CopyLinkButton from "@/components/SharedComponents/Button/CopyLinkButton";
import Flex from "@/components/SharedComponents/Flex";
import OakLink from "@/components/SharedComponents/OakLink";
import { Heading, P, Span } from "@/components/SharedComponents/Typography";

type PostHeaderProps = {
  post: SerializedBlog | SerializedWebinar;
  page: PostCategoryPage;
};

const PostHeader: FC<PostHeaderProps> = ({ post, page }) => {
  const { author } = post;
  const formattedDate = formatDate(post.date);
  return (
    <>
      <Flex $justifyContent="space-between" $flexDirection={["column", "row"]}>
        <Heading tag={"h2"} $color="navy" $font={["heading-7"]}>
          <OakLink page={page} categorySlug={post.category.slug}>
            {post.category.title}
          </OakLink>
        </Heading>
        <Span $font={"body-3"} $mt={[8, 0]}>
          {formattedDate}
        </Span>
      </Flex>
      <Heading $mt={12} $font={["heading-5", "heading-4"]} tag={"h1"}>
        {post.title}
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
                <P $mt={4} $font={"body-3"} $color={"grey60"}>
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

export default PostHeader;
