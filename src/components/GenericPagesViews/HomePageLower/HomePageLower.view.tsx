import {
  OakBox,
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakMaxWidth,
  OakP,
} from "@oaknational/oak-components";

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
import { Testimonials } from "@/components/GenericPagesComponents/Testimonials";
import { HomePage } from "@/common-lib/cms-types";
// import CMSVideo from "@/components/SharedComponents/CMSVideo";

export const postToPostListItem = (post: SerializedPost): PostListItemProps => {
  return post.type === "blog-post"
    ? blogToPostListItem(post)
    : webinarToPostListItem(post);
};

export type HomePageLowerViewProps = {
  posts: SerializedPost[];
  testimonials: HomePage["testimonials"];
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
        <OakGrid
          $pt="inner-padding-xl6"
          $pb="inner-padding-xl7"
          $ph={["inner-padding-m", "inner-padding-xl"]}
        >
          <OakGridArea $colSpan={8} $pr="inner-padding-xl7">
            <OakBox $pb={"inner-padding-m"}>
              <OakHeading tag="h1" $font={"heading-4"}>
                We're here to support great teaching
              </OakHeading>
            </OakBox>
            <OakP $font={"body-1"}>
              Whether you’re creating new lessons, refreshing your approach, or
              solving a last-minute challenge, our resources give you a strong
              foundation that means you get there faster.
            </OakP>
            {/* {introVideo && (
              <CMSVideo
                hideCaptions={true}
                video={introVideo}
                location="marketing"
              />
            )} */}
          </OakGridArea>
          <OakGridArea $colSpan={4}>
            <Testimonials testimonials={props.testimonials} />
          </OakGridArea>
        </OakGrid>
      </OakMaxWidth>
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
