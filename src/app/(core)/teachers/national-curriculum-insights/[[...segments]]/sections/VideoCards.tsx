"use client";

import {
  getBreakpoint,
  getMediaQuery,
  OakBox,
  OakFlex,
  OakFocusIndicator,
  OakHeading,
  OakIcon,
  OakImage,
  OakP,
  OakSpan,
  parseColor,
} from "@oaknational/oak-components";
import Link from "next/link";
import { useId, useState } from "react";
import styled from "styled-components";

import { NationalCurriculumInsightsPortableText as PortableTextWithDefaults } from "../NationalCurriculumInsightsPortableText";

import {
  InsightSection,
  SectionProps,
  insightsTabletMediaQuery,
  imageUrl,
  imageAlt,
  portableTextComponents,
} from "./shared";

import CMSVideo from "@/components/SharedComponents/CMSVideo";

const VideoCardList = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 64px;
  list-style: none;
  margin: 0;
  padding: 0;

  @media (${getMediaQuery("desktop")}) {
    gap: 40px;
  }
`;

const VideoCardItem = styled.li`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const VideoCardsSection = styled(OakBox)`
  box-sizing: border-box;
`;

const ConversationInner = styled(OakFlex)`
  width: 100%;
  max-width: 985px;
`;

const ConversationHeader = styled(OakFlex)`
  width: 100%;

  @media (${getMediaQuery("desktop")}) {
    min-height: 212px;
  }
`;

const ConversationHeaderArtwork = styled(OakBox)`
  display: none;

  @media (${getMediaQuery("desktop")}) {
    display: block;
    width: 250px;
    height: 212px;
    flex: 0 0 250px;
  }

  @media ${insightsTabletMediaQuery} {
    display: none;
  }
`;

const ConversationHeaderCopy = styled(OakFlex)`
  width: 100%;

  @media (${getMediaQuery("desktop")}) {
    width: 690px;
    flex: 0 0 690px;
  }

  @media ${insightsTabletMediaQuery} {
    width: 100%;
    flex: 0 1 auto;
  }
`;

// These fractional values are measured design geometry, not Oak spacing tokens.
// Keep them exact so moving the cards between modules does not alter their layout.
const conversationCardRadius = "6.645px";
const conversationCardInset = "13.291px";

const ConversationCardFocus = styled(OakFocusIndicator)`
  position: relative;
  width: 100%;
  border-radius: ${conversationCardRadius};

  @media (${getMediaQuery("desktop")}) {
    max-width: 985px;
  }
`;

const ConversationCardLink = styled(OakFlex)`
  box-sizing: border-box;
  width: 100%;
  min-height: 100%;
  padding: ${conversationCardInset};
  gap: ${conversationCardInset};
  border-radius: ${conversationCardRadius};
  color: ${parseColor("text-primary")};
  text-decoration: none;
  border: 0;
  background: transparent;
  font: inherit;
  text-align: left;
  cursor: pointer;

  &:hover h3,
  &:hover span {
    text-decoration: underline;
  }

  @media (min-width: ${getBreakpoint("small")}px) {
    flex-direction: row;
  }
`;

const ConversationCardImage = styled(OakBox)`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  flex: 0 0 auto;
  align-self: flex-start;
  overflow: hidden;

  @media ${insightsTabletMediaQuery} {
    width: 40%;
  }

  @media (${getMediaQuery("desktop")}) {
    width: 290px;
    height: auto;
  }
`;

const ThumbnailPlayButton = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 3;
  display: inline-flex;
  width: 64px;
  height: 64px;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 2px solid ${parseColor("border-primary")};
  border-radius: 50%;
  background: ${parseColor("bg-btn-primary")};
  color: ${parseColor("icon-inverted")};
  cursor: pointer;
  transform: translate(-50%, -50%);

  &:hover {
    background: ${parseColor("bg-btn-primary-hover")};
  }

  &:focus-visible {
    outline: 4px solid ${parseColor("border-decorative5")};
    outline-offset: 2px;
  }
`;

const InlineVideo = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;

  > div {
    height: 100%;
  }
`;

const ConversationCardCopy = styled(OakFlex)`
  width: 100%;
  min-width: 0;
`;

const BlogPostTitleLink = styled(Link)`
  color: inherit;
  text-decoration: none;

  &::after {
    position: absolute;
    z-index: 1;
    inset: 0;
    border-radius: ${conversationCardRadius};
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
    outline: 4px solid ${parseColor("border-decorative5")};
    outline-offset: 2px;
  }
`;

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
  <ConversationCardFocus
    $background="bg-primary"
    hoverBackground="bg-btn-secondary-hover"
    $borderRadius="border-radius-m2"
  >
    <ConversationCardLink as="a" href={card.videoUrl} $flexDirection="column">
      <ConversationCardImage $borderRadius="border-radius-m2">
        <OakImage
          src={imageUrl(card.image)}
          alt={imageAlt(card.image)}
          $width="100%"
          $height="100%"
          $objectFit="cover"
        />
      </ConversationCardImage>
      <ConversationCardCopy
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
      </ConversationCardCopy>
    </ConversationCardLink>
  </ConversationCardFocus>
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
      <ConversationCardImage $borderRadius="border-radius-m2">
        {post.video && isPlaying ? (
          <InlineVideo data-testid="guidance-inline-video">
            <CMSVideo
              video={post.video}
              location="blog"
              hideCaptions
              omitBorder
              autoPlay
              autoFocusPlayButton
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
      <ConversationCardCopy
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
      </ConversationCardCopy>
    </>
  );

  return (
    <ConversationCardFocus
      $background="bg-primary"
      hoverBackground="bg-btn-secondary-hover"
      $borderRadius="border-radius-m2"
    >
      <ConversationCardLink as="div" $flexDirection="column">
        {cardContent}
      </ConversationCardLink>
    </ConversationCardFocus>
  );
};

export const NationalCurriculumInsightsVideoCards = ({
  section,
}: SectionProps<"NationalCurriculumInsightsVideoCardsSection">) => {
  const headingId = useId();
  const posts = section.posts ?? [];
  const legacyCards = posts.length > 0 ? [] : (section.cards ?? []);
  const itemCount = posts.length || legacyCards.length;

  return (
    <VideoCardsSection
      as="section"
      $background="bg-decorative5-very-subdued"
      $ph={["spacing-16", "spacing-40"]}
      $pv="spacing-80"
      $borderRadius="border-radius-l"
      aria-labelledby={headingId}
      data-insights-module="guidance-conversations"
    >
      <ConversationInner $mh="auto" $flexDirection="column" $gap="spacing-64">
        <ConversationHeader
          $flexDirection={["column", "column", "row"]}
          $alignItems="center"
          $gap="spacing-40"
        >
          {section.illustration?.asset?.url ? (
            <ConversationHeaderArtwork
              aria-hidden={section.illustration.isPresentational || undefined}
            >
              <OakImage
                src={imageUrl(section.illustration)}
                alt={imageAlt(section.illustration)}
                $width="100%"
                $height="100%"
                $objectFit="contain"
              />
            </ConversationHeaderArtwork>
          ) : null}
          <ConversationHeaderCopy $flexDirection="column" $gap="spacing-20">
            <OakHeading tag="h2" id={headingId} $font="heading-3">
              {section.heading}
            </OakHeading>
            {section.introductionPortableText ? (
              <PortableTextWithDefaults
                value={section.introductionPortableText}
                components={portableTextComponents}
              />
            ) : null}
          </ConversationHeaderCopy>
        </ConversationHeader>
        <VideoCardList>
          {posts.map((post, index) => (
            <VideoCardItem key={post.id}>
              <GuidanceBlogPostCard post={post} episode={itemCount - index} />
            </VideoCardItem>
          ))}
          {legacyCards.map((card, index) => (
            <VideoCardItem key={`${card.heading}-${card.videoUrl}`}>
              <GuidanceConversationCard
                card={card}
                episode={itemCount - index}
              />
            </VideoCardItem>
          ))}
        </VideoCardList>
      </ConversationInner>
    </VideoCardsSection>
  );
};
