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
import CMSVideo from "@/components/SharedComponents/CMSVideo";
import { CampaignPromoBanner } from "@/components/GenericPagesComponents/CampaignPromoBanner/CampaignPromoBanner";
import { campaignTextStyles } from "@/pages/campaigns/[campaignSlug]";
import { CampaignPromoBannerType } from "@/common-lib/cms-types/campaignPage";

export const postToPostListItem = (post: SerializedPost): PostListItemProps => {
  return post.type === "blog-post"
    ? blogToPostListItem(post)
    : webinarToPostListItem(post);
};

export type HomePageLowerViewProps = {
  posts: SerializedPost[];
  testimonials: HomePage["testimonials"];
  campaignPromoBanner?: CampaignPromoBannerType | null;
  introVideo?: HomePage["intro"];
};

export const HomePageLowerView = (props: HomePageLowerViewProps) => {
  const { campaignPromoBanner } = props;

  const posts = props.posts.map(postToPostListItem);
  const blogListProps = usePostList({ items: posts, withImage: true });
  const { introVideo } = props;

  const { track } = useAnalytics();
  const newsletterFormProps = useNewsletterForm({
    onSubmit: track.newsletterSignUpCompleted,
  });

  const showCampaignBanner = campaignPromoBanner?.media[0];

  return (
    <>
      {props.testimonials &&
        introVideo?.mediaType === "video" &&
        introVideo.video && (
          <OakMaxWidth>
            <OakGrid
              $pt={["spacing-56", "spacing-64"]}
              $pb={["spacing-56", "spacing-72"]}
              $ph={["spacing-16", "spacing-24"]}
              $rg={["spacing-56", null]}
            >
              <OakGridArea
                $colSpan={[12, 12, 8]}
                $pr={[null, null, "spacing-72"]}
              >
                <OakFlex
                  $flexDirection={"column"}
                  $gap={["spacing-32", "spacing-32", "spacing-48"]}
                >
                  <OakBox>
                    <OakBox $pb={"spacing-16"}>
                      <OakHeading
                        tag="h1"
                        $font={["heading-5", "heading-5", "heading-4"]}
                      >
                        {introVideo?.title}
                      </OakHeading>
                    </OakBox>
                    <OakP $font={["body-2", "body-2", "body-1"]}>
                      {introVideo?.bodyPortableText?.[0]?.children[0]?.text}
                    </OakP>
                  </OakBox>
                  <CMSVideo
                    hideCaptions={true}
                    video={introVideo.video}
                    location="marketing"
                  />
                </OakFlex>
              </OakGridArea>
              <OakGridArea $colSpan={[12, 12, 4]}>
                <Testimonials testimonials={props.testimonials} />
              </OakGridArea>
            </OakGrid>
          </OakMaxWidth>
        )}
      {showCampaignBanner && (
        <OakMaxWidth>
          <OakBox
            $borderRadius={"border-radius-xl"}
            $background={"bg-decorative5-very-subdued"}
          >
            <CampaignPromoBanner
              textStyles={campaignTextStyles}
              heading={campaignPromoBanner?.headingPortableTextWithPromo}
              subheading={campaignPromoBanner?.subheadingPortableTextWithPromo}
              buttonCta={campaignPromoBanner.buttonCta}
              media={campaignPromoBanner.media[0]!}
              buttonUrl={campaignPromoBanner.buttonUrl}
            />
          </OakBox>
        </OakMaxWidth>
      )}
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
      <OakFlex $background={"bg-decorative3-subdued"} $width={"100%"}>
        <OakMaxWidth
          $alignItems={"center"}
          $background={"bg-decorative3-subdued"}
          $mt={"spacing-56"}
          $mb={"spacing-80"}
          $ph={"spacing-16"}
        >
          <Flex $maxWidth={["100%", 870]}>
            <NewsletterFormWrap desktopColSpan={6} {...newsletterFormProps} />
          </Flex>
        </OakMaxWidth>
      </OakFlex>
    </>
  );
};
