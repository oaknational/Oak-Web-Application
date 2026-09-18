"use client";

import {
  OakBox,
  OakFlex,
  OakFocusIndicator,
  OakHeading,
  OakIcon,
  OakImage,
  OakLI,
  OakP,
  OakSpan,
  OakUL,
  OakVideo,
  parseColor,
  parseBorderWidth,
  parseBorderRadius,
  parseSpacing,
} from "@oaknational/oak-components";
import Link from "next/link";
import { PropsWithChildren, useId, useState } from "react";
import styled from "styled-components";

import { NationalCurriculumInsightsPortableText as PortableTextWithDefaults } from "../PortableText";

import {
  InsightSection,
  SectionProps,
  imageUrl,
  imageAlt,
  portableTextComponents,
} from "./shared";

import VideoPlayer from "@/components/SharedComponents/VideoPlayer";

const ConversationCardLink = styled(OakFlex)`
  font: inherit;
  cursor: pointer;

  &:hover h3,
  &:hover span {
    text-decoration: underline;
  }
`;

const ConversationCardImage = ({ children }: PropsWithChildren) => (
  <OakFlex
    $display="block"
    $position="relative"
    $width={["100%", "40%", "31%"]}
    $aspectRatio="16 / 9"
    $flexGrow={0}
    $flexShrink={0}
    $flexBasis="auto"
    $alignSelf="flex-start"
    $overflow="hidden"
    $borderRadius="border-radius-m2"
  >
    {children}
  </OakFlex>
);

const ThumbnailPlayButton = styled(OakFlex)`
  cursor: pointer;

  &:hover {
    background: ${parseColor("bg-btn-primary-hover")};
  }

  &:focus-visible {
    outline: ${parseBorderWidth("border-solid-xl")} solid
      ${parseColor("border-decorative5")};
    outline-offset: ${parseSpacing("spacing-2")};
  }
`;

// OakVideo does not expose a prop for its inner player's height.
const InlineVideo = styled(OakBox)`
  > div {
    height: 100%;
  }
`;

const BlogPostTitleLink = styled(Link)`
  color: inherit;
  text-decoration: none;

  &::after {
    position: absolute;
    z-index: 1;
    inset: 0;
    border-radius: ${parseBorderRadius("border-radius-m")};
    content: "";
  }

  &:hover,
  &:focus-visible {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: none;
  }

  &:focus-visible::after {
    outline: ${parseBorderWidth("border-solid-xl")} solid
      ${parseColor("border-decorative5")};
    outline-offset: ${parseSpacing("spacing-2")};
  }
`;

const ConversationCard = ({
  children,
  href,
}: PropsWithChildren<{ href?: string }>) => (
  <OakFocusIndicator
    $position="relative"
    $width="100%"
    $maxWidth="spacing-960"
    $background="bg-primary"
    hoverBackground="bg-btn-secondary-hover"
    $borderRadius="border-radius-m"
  >
    <ConversationCardLink
      $boxSizing="border-box"
      $width="100%"
      $minHeight="100%"
      $color="text-primary"
      $textDecoration="none"
      $ba="border-solid-none"
      $background="transparent"
      $textAlign="left"
      $pa="spacing-12"
      $gap="spacing-12"
      $borderRadius="border-radius-m"
      as={href ? "a" : "div"}
      href={href}
      $flexDirection={["column", "row", "row"]}
    >
      {children}
    </ConversationCardLink>
  </OakFocusIndicator>
);

const GuidanceConversationCard = ({
  card,
  episode,
}: {
  card: NonNullable<
    Extract<
      InsightSection,
      { __typename: "NationalCurriculumInsightsVideoCardsSection" }
    >["cards"]
  >[number];
  episode: number;
}) => (
  <ConversationCard href={card.videoUrl}>
    <ConversationCardImage>
      <OakImage
        src={imageUrl(card.image)}
        alt={imageAlt(card.image)}
        $width="100%"
        $height="100%"
        $objectFit="cover"
      />
    </ConversationCardImage>
    <OakFlex
      $width="100%"
      $minWidth="spacing-0"
      $flexDirection="column"
      $justifyContent="space-between"
      $gap="spacing-20"
    >
      <OakFlex $flexDirection="column" $gap="spacing-12">
        <OakHeading tag="h3" $font="heading-7">
          {card.heading}
        </OakHeading>
        <OakP $font="body-3" $color="text-subdued" $mv="spacing-0">
          {card.description}
        </OakP>
      </OakFlex>
      <OakFlex $alignItems="center" $justifyContent="flex-end" $gap="spacing-4">
        <OakSpan $font="body-3">Watch episode {episode}</OakSpan>
        <OakIcon
          iconName="arrow-right"
          alt=""
          $width="spacing-20"
          $height="spacing-20"
        />
      </OakFlex>
    </OakFlex>
  </ConversationCard>
);

const GuidanceBlogPostCard = ({
  post,
  episode,
}: {
  post: NonNullable<
    Extract<
      InsightSection,
      { __typename: "NationalCurriculumInsightsVideoCardsSection" }
    >["posts"]
  >[number];
  episode: number;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const cardContent = (
    <>
      <ConversationCardImage>
        {post.video && isPlaying ? (
          <InlineVideo
            $position="relative"
            $zIndex={2}
            $width="100%"
            $height="100%"
            data-testid="guidance-inline-video"
          >
            <OakVideo
              showTranscript={false}
              videoSlot={
                <VideoPlayer
                  playbackPolicy="public"
                  playbackId={post.video.video.asset.playbackId}
                  thumbnailTime={post.video.video.asset.thumbTime}
                  title={post.title}
                  location="blog"
                  omitBorder={true}
                  autoPlay={true}
                  autoFocusPlayButton={true}
                />
              }
            />
          </InlineVideo>
        ) : (
          <>
            <OakImage
              src={imageUrl(post.image)}
              alt={imageAlt(post.image)}
              $width="100%"
              $height="100%"
              $objectFit="cover"
            />
            {post.video ? (
              <ThumbnailPlayButton
                as="button"
                $position="absolute"
                $top="50%"
                $left="50%"
                $zIndex={3}
                $display="inline-flex"
                $width="spacing-64"
                $height="spacing-64"
                $alignItems="center"
                $justifyContent="center"
                $pa="spacing-0"
                $ba="border-solid-m"
                $borderColor="border-primary"
                $borderRadius="border-radius-circle"
                $background="bg-btn-primary"
                $color="icon-inverted"
                $transform="translate(-50%, -50%)"
                type="button"
                aria-label={`Play ${post.title}`}
                onClick={() => setIsPlaying(true)}
              >
                <OakIcon
                  iconName="play"
                  alt=""
                  $color="icon-inverted"
                  $width="spacing-32"
                  $height="spacing-32"
                />
              </ThumbnailPlayButton>
            ) : null}
          </>
        )}
      </ConversationCardImage>
      <OakFlex
        $width="100%"
        $minWidth="spacing-0"
        $flexDirection="column"
        $justifyContent="space-between"
        $gap="spacing-20"
      >
        <OakFlex $flexDirection="column" $gap="spacing-12">
          <OakHeading tag="h3" $font="heading-7">
            <BlogPostTitleLink href={`/blog/${post.slug}`}>
              {post.title}
            </BlogPostTitleLink>
          </OakHeading>
          <OakP $font="body-3" $color="text-subdued" $mv="spacing-0">
            {post.summary}
          </OakP>
        </OakFlex>
        <OakFlex
          $alignItems="center"
          $justifyContent="flex-end"
          $gap="spacing-4"
        >
          <OakSpan $font="body-3">Watch episode {episode}</OakSpan>
          <OakIcon
            iconName="arrow-right"
            alt=""
            $width="spacing-20"
            $height="spacing-20"
          />
        </OakFlex>
      </OakFlex>
    </>
  );

  return <ConversationCard>{cardContent}</ConversationCard>;
};

export const NationalCurriculumInsightsVideoCards = ({
  section,
}: SectionProps<"NationalCurriculumInsightsVideoCardsSection">) => {
  const headingId = useId();
  const posts = section.posts ?? [];
  const legacyCards = section.posts === undefined ? (section.cards ?? []) : [];
  const itemCount = posts.length || legacyCards.length;

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
      <OakFlex
        $width="100%"
        $maxWidth="spacing-960"
        $mh="auto"
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
            <OakBox
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
            </OakBox>
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
              <GuidanceBlogPostCard post={post} episode={itemCount - index} />
            </OakLI>
          ))}
          {legacyCards.map((card, index) => (
            <OakLI
              $width="100%"
              $display="flex"
              $justifyContent="center"
              key={`${card.heading}-${card.videoUrl}`}
            >
              <GuidanceConversationCard
                card={card}
                episode={itemCount - index}
              />
            </OakLI>
          ))}
        </OakUL>
      </OakFlex>
    </OakBox>
  );
};
