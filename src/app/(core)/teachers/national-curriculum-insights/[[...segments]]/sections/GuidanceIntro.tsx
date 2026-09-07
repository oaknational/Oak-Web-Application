"use client";

import {
  getMediaQuery,
  OakBox,
  OakFlex,
  OakHeading,
  OakImage,
  OakSpan,
  parseColor,
} from "@oaknational/oak-components";
import { useId } from "react";
import styled from "styled-components";

import { NationalCurriculumInsightsPortableText as PortableTextWithDefaults } from "../NationalCurriculumInsightsPortableText";

import {
  SectionProps,
  insightsTabletMediaQuery,
  insightsWideDesktopMediaQuery,
  imageUrl,
  imageAlt,
  guidancePortableTextComponents,
  SectionMaxWidth,
} from "./shared";

const GuidanceIntroImage = styled(OakBox)`
  width: 100%;
  aspect-ratio: 3 / 2;
  overflow: hidden;
  border: 2px solid ${parseColor("border-primary")};

  @media (${getMediaQuery("desktop")}) {
    width: 363px;
    height: 242px;
    flex: 0 0 363px;
  }

  @media ${insightsTabletMediaQuery} {
    width: clamp(291px, calc(13.585vw + 189.113px), 363px);
    height: auto;
    flex: 0 0 auto;
  }
`;

const GuidanceIntroLayout = styled(OakBox)`
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  row-gap: 20px;

  @media (${getMediaQuery("desktop")}) {
    grid-template-columns: 363px 684px;
    grid-template-rows: auto 1fr;
    column-gap: 40px;
    row-gap: 40px;
    align-items: start;
  }

  @media ${insightsTabletMediaQuery} {
    width: clamp(675px, calc(51.887vw + 285.849px), 950px);
    max-width: 100%;
    grid-template-columns:
      clamp(291px, calc(13.585vw + 189.113px), 363px)
      minmax(0, 1fr);
    grid-template-rows: auto 1fr;
    column-gap: 40px;
    row-gap: clamp(20px, calc(3.774vw - 8.302px), 40px);
    align-items: start;
    margin-inline: auto;
  }
`;

const GuidanceIntroHeading = styled(OakHeading)`
  grid-column: 1;
  grid-row: 1;

  @media (${getMediaQuery("desktop")}) {
    grid-column: 2;
  }

  @media ${insightsTabletMediaQuery} {
    grid-column: 2;
    grid-row: 1;
  }
`;

const GuidanceIntroDesktopHeading = styled.span`
  display: none;

  @media ${insightsWideDesktopMediaQuery} {
    display: inline;
  }
`;

const GuidanceIntroMobileHeading = styled.span`
  @media ${insightsWideDesktopMediaQuery} {
    display: none;
  }
`;

const GuidanceIntroBody = styled(OakFlex)`
  grid-column: 1;
  grid-row: 3;

  @media (${getMediaQuery("desktop")}) {
    grid-column: 2;
    grid-row: 2;
  }

  @media ${insightsTabletMediaQuery} {
    grid-column: 2;
    grid-row: 2;
  }
`;

const GuidanceIntroArtwork = styled(GuidanceIntroImage)`
  grid-column: 1;
  grid-row: 2;

  @media (${getMediaQuery("desktop")}) {
    grid-row: 1 / span 2;
  }

  @media ${insightsTabletMediaQuery} {
    grid-column: 1;
    grid-row: 1 / span 2;
  }
`;

const GuidanceTaggedParagraph = styled(OakBox)`
  > div:first-child {
    float: left;
    margin: 0 8px 0 0;
  }

  &::after {
    display: table;
    clear: both;
    content: "";
  }
`;

const GuidanceStatusTag = styled(OakBox)`
  width: fit-content;
  white-space: nowrap;

  > div {
    width: max-content;
    min-width: 141px;
    justify-content: center;
    white-space: nowrap;
  }
`;

const GuidanceClockIcon = () => (
  <svg
    aria-hidden="true"
    data-testid="guidance-status-clock"
    focusable="false"
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="none"
  >
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="2" />
    <path
      d="M12 7.5V12l3 2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const GuidanceStatusLabel = ({ label }: { label: string }) => (
  <OakFlex
    $alignItems="center"
    $justifyContent="center"
    $gap="spacing-4"
    $background="bg-decorative5-main"
    $color="text-primary"
    $borderRadius="border-radius-s"
    $ph="spacing-8"
    $pv="spacing-4"
  >
    <GuidanceClockIcon />
    <OakSpan $font="heading-7">{label}</OakSpan>
  </OakFlex>
);

export const NationalCurriculumInsightsGuidanceIntro = ({
  section,
}: SectionProps<"NationalCurriculumInsightsGuidanceIntroSection">) => {
  const headingId = useId();
  const [leadBlock, ...remainingBlocks] = section.bodyPortableText;
  const hasTaggedSecondParagraph = Boolean(
    section.statusLabel && leadBlock && remainingBlocks.length > 0,
  );

  return (
    <OakBox
      as="section"
      $background="bg-primary"
      $ph={["spacing-24", "spacing-40"]}
      $pv={["spacing-32", "spacing-32", "spacing-40"]}
      aria-labelledby={headingId}
      data-insights-module="guidance-introduction"
    >
      <SectionMaxWidth $mh="auto">
        <GuidanceIntroLayout>
          <GuidanceIntroHeading id={headingId} tag="h2" $font="heading-5">
            <GuidanceIntroMobileHeading>
              This term, you’ll find:
            </GuidanceIntroMobileHeading>
            <GuidanceIntroDesktopHeading>
              {section.heading}
            </GuidanceIntroDesktopHeading>
          </GuidanceIntroHeading>
          <GuidanceIntroArtwork
            aria-hidden={section.image.isPresentational || undefined}
          >
            <OakImage
              src={imageUrl(section.image)}
              alt={imageAlt(section.image)}
              $width="100%"
              $height="100%"
              $objectFit="cover"
            />
          </GuidanceIntroArtwork>
          <GuidanceIntroBody $flexDirection="column" $gap="spacing-24">
            {hasTaggedSecondParagraph ? (
              <>
                <PortableTextWithDefaults
                  value={[leadBlock]}
                  components={guidancePortableTextComponents}
                />
                <GuidanceTaggedParagraph>
                  <GuidanceStatusTag>
                    <GuidanceStatusLabel label={section.statusLabel!} />
                  </GuidanceStatusTag>
                  <PortableTextWithDefaults
                    value={remainingBlocks}
                    components={guidancePortableTextComponents}
                  />
                </GuidanceTaggedParagraph>
              </>
            ) : (
              <>
                <PortableTextWithDefaults
                  value={section.bodyPortableText}
                  components={guidancePortableTextComponents}
                />
                {section.statusLabel ? (
                  <GuidanceStatusTag $alignSelf="flex-start">
                    <GuidanceStatusLabel label={section.statusLabel} />
                  </GuidanceStatusTag>
                ) : null}
              </>
            )}
          </GuidanceIntroBody>
        </GuidanceIntroLayout>
      </SectionMaxWidth>
    </OakBox>
  );
};
