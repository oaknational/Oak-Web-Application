"use client";

import {
  OakBox,
  OakCard,
  OakFlex,
  OakGrid,
  OakHeading,
  OakImage,
  OakLI,
  OakUL,
  OakVideo,
} from "@oaknational/oak-components";
import { useId } from "react";

import { NationalCurriculumInsightsPortableText as PortableTextWithDefaults } from "../PortableText";

import {
  InsightSection,
  SectionProps,
  imageUrl,
  imageAlt,
  portableTextComponents,
} from "./shared";

import VideoPlayer from "@/components/SharedComponents/VideoPlayer";

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
  const card = (
    <OakCard
      heading={post.title}
      href={`/blog/${post.slug}`}
      subCopy={post.summary}
      subCopyColor="text-subdued"
      linkText={`Watch episode ${episode}`}
      cardWidth="100%"
      cardOrientation={post.video ? "column" : ["column", "row"]}
      imageSrc={post.video ? undefined : imageUrl(post.image)}
      imageAlt={imageAlt(post.image)}
      aspectRatio="4/3"
    />
  );

  if (!post.video) return card;

  return (
    <OakGrid
      $width="100%"
      $background="bg-primary"
      $borderRadius="border-radius-m2"
      $gridTemplateColumns={[
        "minmax(0, 1fr)",
        "minmax(0, 2fr) minmax(0, 3fr)",
        "minmax(0, 31fr) minmax(0, 69fr)",
      ]}
    >
      <OakBox
        $pa="spacing-16"
        $minWidth="spacing-0"
        data-testid="guidance-inline-video"
      >
        <OakBox $borderRadius="border-radius-m2" $overflow="hidden">
          <OakVideo
            showTranscript={false}
            videoSlot={
              <VideoPlayer
                playbackPolicy="public"
                playbackId={post.video.video.asset.playbackId}
                thumbnailTime={post.video.video.asset.thumbTime}
                poster={
                  post.image.asset?.url ? imageUrl(post.image) : undefined
                }
                title={post.title}
                location="blog"
                omitBorder
              />
            }
          />
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
              <OakCard
                heading={card.heading}
                href={card.videoUrl}
                subCopy={card.description}
                subCopyColor="text-subdued"
                imageSrc={imageUrl(card.image)}
                imageAlt={imageAlt(card.image)}
                aspectRatio="4/3"
                cardWidth="100%"
                cardOrientation={["column", "row"]}
                linkText={`Watch episode ${itemCount - index}`}
              />
            </OakLI>
          ))}
        </OakUL>
      </OakFlex>
    </OakBox>
  );
};
