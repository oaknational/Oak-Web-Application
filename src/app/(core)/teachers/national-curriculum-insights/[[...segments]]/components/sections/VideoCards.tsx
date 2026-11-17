"use client";

import {
  OakBox,
  OakFlex,
  OakGrid,
  OakGridArea,
  OakFocusIndicator,
  OakHeading,
  OakIcon,
  OakImage,
  OakLI,
  OakP,
  OakSpan,
  OakUL,
  OakVideo,
} from "@oaknational/oak-components";
import { useId, useState } from "react";

import { NationalCurriculumInsightsPortableText as PortableTextWithDefaults } from "../PortableText";

import {
  InsightSection,
  SectionProps,
  imageUrl,
  imageAlt,
  portableTextComponents,
} from "./shared";

import VideoPlayer from "@/components/SharedComponents/VideoPlayer";

type InsightsBlogPost = NonNullable<
  Extract<
    InsightSection,
    { __typename: "NationalCurriculumInsightsVideoCardsSection" }
  >["posts"]
>[number];

const InsightsBlogPostMedia = ({ post }: { post: InsightsBlogPost }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!post.video) {
    return (
      <OakImage
        src={imageUrl(post.image)}
        alt={imageAlt(post.image)}
        $width="100%"
        $aspectRatio="16 / 9"
        $objectFit="cover"
      />
    );
  }

  if (!post.image.asset?.url || isPlaying) {
    return (
      <OakVideo
        showTranscript={false}
        videoSlot={
          <VideoPlayer
            playbackPolicy="public"
            playbackId={post.video.video.asset.playbackId}
            thumbnailTime={post.video.video.asset.thumbTime}
            poster={post.image.asset?.url ? imageUrl(post.image) : undefined}
            title={post.title}
            location="blog"
            omitBorder
            autoPlay={isPlaying}
            autoFocusPlayButton={isPlaying}
          />
        }
      />
    );
  }

  return (
    <OakFocusIndicator $width="100%" $borderRadius="border-radius-m2">
      <OakBox
        as="button"
        type="button"
        aria-label={`Play ${post.title}`}
        onClick={() => setIsPlaying(true)}
        $position="relative"
        $display="block"
        $width="100%"
        $aspectRatio="16 / 9"
        $pa="spacing-0"
        $ba="border-solid-none"
      >
        <OakImage
          src={imageUrl(post.image)}
          alt=""
          $width="100%"
          $height="100%"
          $objectFit="cover"
        />
        <OakFlex
          $position="absolute"
          $inset="spacing-0"
          $alignItems="center"
          $justifyContent="center"
        >
          <OakFlex
            $width="spacing-56"
            $height="spacing-56"
            $borderRadius="border-radius-circle"
            $background="bg-btn-primary"
            $alignItems="center"
            $justifyContent="center"
          >
            <OakIcon
              iconName="play"
              $width="spacing-24"
              $height="spacing-24"
              $color="text-inverted"
            />
          </OakFlex>
        </OakFlex>
      </OakBox>
    </OakFocusIndicator>
  );
};

const InsightsBlogPostCard = ({
  post,
  episode,
}: {
  post: InsightsBlogPost;
  episode: number;
}) => {
  const card = (
    <OakFocusIndicator $width="100%" $borderRadius="border-radius-m2">
      <OakFlex
        as="a"
        href={`/blog/${post.slug}`}
        $height="100%"
        $pa="spacing-16"
        $flexDirection="column"
        $justifyContent="space-between"
        $gap="spacing-16"
        $borderRadius="border-radius-m2"
      >
        <OakFlex $flexDirection="column" $gap="spacing-12">
          <OakHeading tag="h3" $font="heading-7">
            {post.title}
          </OakHeading>
          <OakP $font="body-3" $color="text-subdued" $mv="spacing-0">
            {post.summary}
          </OakP>
        </OakFlex>
        <OakFlex $alignItems="center" $justifyContent="flex-end">
          <OakSpan $font="body-3">Watch episode {episode}</OakSpan>
          <OakIcon
            iconName="arrow-right"
            $width="spacing-20"
            $height="spacing-20"
          />
        </OakFlex>
      </OakFlex>
    </OakFocusIndicator>
  );

  return (
    <OakGrid
      $width="100%"
      $background="bg-primary"
      $borderRadius="border-radius-m2"
      $gridTemplateColumns={[
        "minmax(0, 1fr)",
        "minmax(0, 2fr) minmax(0, 3fr)",
        "minmax(0, 19rem) minmax(0, 1fr)",
      ]}
    >
      <OakBox
        $pa="spacing-16"
        $minWidth="spacing-0"
        data-testid="guidance-inline-video"
      >
        <OakBox $borderRadius="border-radius-m2" $overflow="hidden">
          <InsightsBlogPostMedia post={post} />
        </OakBox>
      </OakBox>
      {card}
    </OakGrid>
  );
};

export const NationalCurriculumInsightsVideoCards = ({
  section,
}: SectionProps<"NationalCurriculumInsightsVideoCardsSection">) => {
  const headingId = useId();
  const posts = section.posts;
  const itemCount = posts.length;

  if (itemCount === 0) return null;

  return (
    <OakBox
      $boxSizing="border-box"
      as="section"
      $background="bg-decorative5-very-subdued"
      $ph={["spacing-16", "spacing-40"]}
      $pv="spacing-80"
      $borderRadius="border-radius-l"
      aria-labelledby={headingId}
      data-insights-module="guidance-conversations"
    >
      <OakGrid
        $width="100%"
        $gridTemplateColumns="1fr minmax(0, 61.5rem) 1fr"
        $mh="auto"
      >
        <OakGridArea
          $colSpan={1}
          $colStart={2}
          $flexDirection="column"
          $gap="spacing-64"
        >
          <OakFlex
            $width="100%"
            $flexDirection={["column", "column", "row"]}
            $alignItems="center"
            $gap="spacing-40"
          >
            {section.illustration?.asset?.url ? (
              <OakFlex
                $display={["none", "none", "block"]}
                $width="spacing-240"
                $flexShrink={0}
                $aspectRatio="250 / 212"
                aria-hidden={section.illustration.isPresentational || undefined}
              >
                <OakImage
                  src={imageUrl(section.illustration)}
                  alt={imageAlt(section.illustration)}
                  $width="100%"
                  $height="100%"
                  $objectFit="contain"
                />
              </OakFlex>
            ) : null}
            <OakFlex
              $minWidth="spacing-0"
              $width="100%"
              $flexGrow={1}
              $flexDirection="column"
              $gap="spacing-20"
            >
              <OakHeading tag="h2" id={headingId} $font="heading-3">
                {section.heading}
              </OakHeading>
              {section.introductionPortableText ? (
                <PortableTextWithDefaults
                  value={section.introductionPortableText}
                  components={portableTextComponents}
                />
              ) : null}
            </OakFlex>
          </OakFlex>
          <OakUL
            $reset
            $display="flex"
            $flexDirection="column"
            $alignItems="center"
            $gap={["spacing-64", "spacing-64", "spacing-40"]}
          >
            {posts.map((post, index) => (
              <OakLI
                $width="100%"
                $display="flex"
                $justifyContent="center"
                key={post.id}
              >
                <InsightsBlogPostCard post={post} episode={itemCount - index} />
              </OakLI>
            ))}
          </OakUL>
        </OakGridArea>
      </OakGrid>
    </OakBox>
  );
};
