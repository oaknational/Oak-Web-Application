import { OakFlex, OakMaxWidth } from "@oaknational/oak-components";

import Flex from "@/components/SharedComponents/Flex.deprecated";
import BlogAndWebinarList from "@/components/GenericPagesComponents/BlogAndWebinarList";
import NewsletterFormWrap from "@/components/GenericPagesComponents/NewsletterFormWrap";
import usePostList from "@/components/SharedComponents/PostList/usePostList";
import { useNewsletterForm } from "@/components/GenericPagesComponents/NewsletterForm";
import { PostListItemProps } from "@/components/SharedComponents/PostListItem";
import { blogToPostListItem } from "@/components/GenericPagesViews/BlogIndex.view";
import { SerializedPost } from "@/pages-helpers/home/getBlogPosts";
import { webinarToPostListItem } from "@/components/GenericPagesViews/WebinarsIndex.view";
import useAnalytics from "@/context/Analytics/useAnalytics";

export const postToPostListItem = (post: SerializedPost): PostListItemProps => {
  return post.type === "blog-post"
    ? blogToPostListItem(post)
    : webinarToPostListItem(post);
};

export type HomePageLowerViewProps = {
  posts: SerializedPost[];
};

export const HomePageLowerView = (props: HomePageLowerViewProps) => {
  const posts = props.posts.map(postToPostListItem);
  const blogListProps = usePostList({ items: posts, withImage: true });
  const { track } = useAnalytics();
  const newsletterFormProps = useNewsletterForm({
    onSubmit: track.newsletterSignUpCompleted,
  });

  return (
    <>
      <OakMaxWidth>
        <BlogAndWebinarList
          blogListPosts={blogListProps}
          showImageOnTablet={true}
          backgroundColor="white"
          displayOnPhone={true}
          isBackgroundWhite={true}
          title={"Stay up to date"}
        />
      </OakMaxWidth>
      <OakFlex $background={"lavender50"} $width={"100%"}>
        <OakMaxWidth
          $alignItems={"center"}
          $background={"lavender50"}
          $mt={"space-between-xl"}
          $mb={"space-between-xxxl"}
          $ph={"inner-padding-m"}
        >
          <Flex $maxWidth={["100%", 870]}>
            <NewsletterFormWrap desktopColSpan={6} {...newsletterFormProps} />
          </Flex>
        </OakMaxWidth>
      </OakFlex>
    </>
  );
};
