"use client";

import {
  OakBox,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakImage,
  OakPrimaryButton,
  OakVideo,
} from "@oaknational/oak-components";
import Link from "next/link";
import { useId } from "react";

import { NationalCurriculumInsightsPortableText as PortableTextWithDefaults } from "../PortableText";

import {
  ContextualSectionProps,
  imageUrl,
  imageAlt,
  guidancePortableTextComponents,
  SectionMaxWidth,
} from "./shared";

import { getImageDimensions } from "@/components/HooksAndUtils/sanityImageBuilder";
import VideoPlayer from "@/components/SharedComponents/VideoPlayer";

const editorialBackground = {
  white: "bg-primary",
  turquoise: "bg-decorative2-subdued",
  yellow: "bg-decorative5-very-subdued",
  green: "bg-decorative1-very-subdued",
} as const;

type ImageTextProps =
  ContextualSectionProps<"NationalCurriculumInsightsImageTextSection">;

const mediaAspectRatio = (section: ImageTextProps["section"]) => {
  if (section.video) return undefined;
  const assetId = section.image?.asset?._id;
  return assetId ? getImageDimensions(assetId, {}).aspectRatio : 16 / 10;
};

const EditorialMedia = ({
  section,
  isGuidance,
}: Pick<ImageTextProps, "section"> & { isGuidance: boolean }) => {
  if (section.video)
    return (
      <OakVideo
        videoSlot={
          <VideoPlayer
            playbackPolicy="public"
            playbackId={section.video.video.asset.playbackId}
            thumbnailTime={section.video.video.asset.thumbTime}
            title={section.video.title}
            poster={section.image ? imageUrl(section.image) : undefined}
            location="marketing"
            omitBorder
          />
        }
        showTranscript={Boolean(section.video.transcript?.length)}
        transcript={section.video.transcript}
      />
    );
  if (!section.image) return null;
  return (
    <OakImage
      src={imageUrl(section.image)}
      alt={imageAlt(section.image)}
      $width="100%"
      $height="100%"
      $objectFit={isGuidance ? "contain" : "cover"}
    />
  );
};

export const NationalCurriculumInsightsImageText = ({
  section,
  data,
}: ImageTextProps) => {
  const headingId = useId();
  const isGuidance = data.route.kind === "guidance";
  const decorativeMedia =
    (!section.video && section.image?.isPresentational) || undefined;
  const mirrorImage = !section.video && section.mirrorImage;
  const media = <EditorialMedia section={section} isGuidance={isGuidance} />;

  if (isGuidance) {
    return (
      <OakBox
        as="section"
        $background="bg-decorative1-very-subdued"
        $ph="spacing-40"
        $pv={["spacing-48", "spacing-64", "spacing-40"]}
        aria-labelledby={headingId}
        data-insights-module="guidance-benefits"
      >
        <SectionMaxWidth>
          <OakGrid
            $cg={["spacing-0", "spacing-0", "spacing-40"]}
            $rg="spacing-40"
          >
            <OakGridArea $colSpan={[12, 12, 8]} $colStart={1} $rowStart={1}>
              <OakHeading tag="h2" id={headingId} $font="heading-5">
                {section.heading}
              </OakHeading>
            </OakGridArea>
            <OakGridArea
              $colSpan={[12, 12, 4]}
              $colStart={[1, 1, 8]}
              $rowStart={[2, 2, 1]}
              $rowSpan={[1, 1, 2]}
              $alignItems="center"
              $justifyContent="center"
            >
              <OakBox
                $width="100%"
                $maxWidth="spacing-360"
                $aspectRatio={section.video ? undefined : "332 / 259"}
                aria-hidden={decorativeMedia}
                style={{
                  transform: mirrorImage ? "scaleX(-1)" : undefined,
                }}
              >
                {media}
              </OakBox>
            </OakGridArea>
            <OakGridArea
              $colSpan={[12, 12, 7]}
              $colStart={1}
              $rowStart={[3, 3, 2]}
            >
              <OakBox>
                <PortableTextWithDefaults
                  value={section.bodyPortableText}
                  components={guidancePortableTextComponents}
                />
              </OakBox>
            </OakGridArea>
          </OakGrid>
        </SectionMaxWidth>
      </OakBox>
    );
  }

  return (
    <OakBox
      as="section"
      $background={editorialBackground[section.background]}
      $ph={["spacing-20", "spacing-40"]}
      $pv={["spacing-48", "spacing-64"]}
      aria-labelledby={headingId}
      data-insights-module="image-text"
    >
      <SectionMaxWidth>
        <OakGrid
          $cg={["spacing-0", "spacing-0", "spacing-40"]}
          $rg="spacing-32"
          $alignItems="center"
        >
          <OakGridArea
            $colSpan={[12, 12, 5]}
            $order={[1, 1, section.imagePosition === "left" ? 0 : 1]}
          >
            <OakBox
              $width="100%"
              $aspectRatio={mediaAspectRatio(section)}
              $overflow="hidden"
              $borderRadius="border-radius-m2"
              aria-hidden={decorativeMedia}
            >
              {media}
            </OakBox>
          </OakGridArea>
          <OakGridArea
            $colSpan={[12, 12, 7]}
            $display={["contents", "contents", "flex"]}
            $flexDirection="column"
            $gap="spacing-24"
          >
            <OakGridArea $order={0} $colSpan={12}>
              <OakHeading tag="h2" id={headingId} $font="heading-5">
                {section.heading}
              </OakHeading>
            </OakGridArea>
            <OakGridArea
              $flexDirection="column"
              $gap="spacing-24"
              $order={[2, 2, 0]}
              $colSpan={12}
            >
              <PortableTextWithDefaults
                value={section.bodyPortableText}
                components={guidancePortableTextComponents}
              />
              {section.ctaLabel && section.ctaHref ? (
                <OakPrimaryButton
                  element={Link}
                  href={section.ctaHref}
                  iconName="arrow-right"
                  isTrailingIcon
                >
                  {section.ctaLabel}
                </OakPrimaryButton>
              ) : null}
            </OakGridArea>
          </OakGridArea>
        </OakGrid>
      </SectionMaxWidth>
    </OakBox>
  );
};
