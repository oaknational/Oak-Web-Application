import { OakFlex } from "@oaknational/oak-components";

// FIXME: Would be great to remove these two deprecated components but would require some design decisions due to use of non-valid pixel values
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import Flex from "@/components/SharedComponents/Flex.deprecated";
import BlogAndWebinarList from "@/components/GenericPagesComponents/BlogAndWebinarList";
import NewsletterFormWrap from "@/components/GenericPagesComponents/NewsletterFormWrap";
import usePostList from "@/components/SharedComponents/PostList/usePostList";
import { useNewsletterForm } from "@/components/GenericPagesComponents/NewsletterForm";
import { PostListItemProps } from "@/components/SharedComponents/PostListItem";
import {
  blogToPostListItem,
  SerializedBlogPostPreview,
} from "@/components/GenericPagesViews/BlogIndex.view";
import {
  webinarToPostListItem,
  SerializedWebinarPreview,
} from "@/components/GenericPagesViews/WebinarsIndex.view";
import useAnalytics from "@/context/Analytics/useAnalytics";

export type SerializedPost =
  | ({ type: "blog-post" } & SerializedBlogPostPreview)
  | ({ type: "webinar" } & SerializedWebinarPreview);

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
      <MaxWidth>
        <BlogAndWebinarList
          blogListPosts={blogListProps}
          showImageOnTablet={true}
          backgroundColor="white"
          displayOnPhone={true}
          isBackgroundWhite={true}
          title={"Stay up to date"}
        />
      </MaxWidth>
      <OakFlex $background={"lavender50"} $width={"100%"}>
        <MaxWidth
          $alignItems={"center"}
          $background={"lavender50"}
          $mt={58}
          $mb={80}
          $ph={16}
        >
          <Flex $maxWidth={["100%", 870]}>
            <NewsletterFormWrap desktopColSpan={6} {...newsletterFormProps} />
          </Flex>
        </MaxWidth>
      </OakFlex>
    </>
  );
};
