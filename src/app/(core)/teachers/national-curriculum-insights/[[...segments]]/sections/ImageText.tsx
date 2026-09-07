"use client";

import {
  getBreakpoint,
  getMediaQuery,
  OakBox,
  OakFlex,
  OakHeading,
  OakImage,
  OakLink,
} from "@oaknational/oak-components";
import { useId } from "react";
import styled from "styled-components";

import { NationalCurriculumInsightsPortableText as PortableTextWithDefaults } from "../NationalCurriculumInsightsPortableText";

import {
  ContextualSectionProps,
  insightsTabletMediaQuery,
  insightsWideDesktopMediaQuery,
  imageUrl,
  imageAlt,
  portableTextComponents,
  guidancePortableTextComponents,
  SectionMaxWidth,
} from "./shared";

const EditorialImage = styled(OakBox)`
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;

  @media (${getMediaQuery("desktop")}) {
    width: 50%;
  }
`;

const EditorialCopy = styled(OakFlex)`
  width: 100%;

  @media (${getMediaQuery("desktop")}) {
    width: 50%;
  }
`;

const editorialBackground = {
  white: "bg-primary",
  turquoise: "bg-decorative2-subdued",
  yellow: "bg-decorative5-very-subdued",
} as const;

const EditorialSection = styled(OakBox)`
  @media (${getMediaQuery("desktop")}) {
    min-height: 452px;
    display: flex;
    align-items: center;
  }
`;

const GuidanceExplainerSection = styled(OakBox)`
  box-sizing: border-box;

  @media (${getMediaQuery("desktop")}) {
    min-height: 480px;
    display: flex;
    align-items: center;
  }

  @media ${insightsTabletMediaQuery} {
    min-height: auto;
    display: block;
  }
`;

const GuidanceExplainerLayout = styled(OakBox)`
  width: 100%;
  max-width: 1218px;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 40px;

  @media (${getMediaQuery("desktop")}) {
    grid-template-columns: 684px minmax(0, 1fr);
    grid-template-rows: auto auto;
    column-gap: 40px;
    row-gap: 40px;
    align-items: center;
  }

  @media ${insightsTabletMediaQuery} {
    width: clamp(670px, calc(58.302vw + 232.736px), 979px);
    max-width: 100%;
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto auto auto;
    gap: 40px;
  }
`;

const GuidanceExplainerHeading = styled(OakHeading)`
  grid-column: 1;
  grid-row: 1;
  letter-spacing: -0.02em;

  @media ${insightsWideDesktopMediaQuery} {
    grid-column: 1 / -1;
    width: 727px;
    max-width: 100%;
  }
`;

const GuidanceExplainerImage = styled(OakBox)<{ $mirror?: boolean }>`
  width: 269px;
  max-width: 100%;
  aspect-ratio: 332 / 259;
  justify-self: center;
  overflow: hidden;

  img {
    transform: ${({ $mirror }) => ($mirror ? "scaleX(-1)" : "none")};
  }

  @media (min-width: 376px) and (max-width: ${getBreakpoint("small") - 1}px) {
    width: clamp(269px, calc(62.032vw + 35.76px), 501px);
  }

  @media (${getMediaQuery("desktop")}) {
    width: 332px;
    height: 259px;
    grid-column: 2;
    grid-row: 1 / span 2;
  }

  @media ${insightsWideDesktopMediaQuery} {
    grid-row: 1 / span 2;
    justify-self: start;
  }

  @media ${insightsTabletMediaQuery} {
    width: 332px;
    height: 259px;
    grid-column: 1;
    grid-row: 2;
  }
`;

const GuidanceExplainerBody = styled(OakBox)`
  grid-column: 1;
  grid-row: 3;

  @media (${getMediaQuery("desktop")}) {
    grid-row: 2;
  }

  @media ${insightsTabletMediaQuery} {
    grid-column: 1;
    grid-row: 3;
  }

  ul {
    margin: 0;
    padding-left: 27px;
  }

  li + li {
    margin-top: 12px;
  }
`;

export const NationalCurriculumInsightsImageText = ({
  section,
  data,
}: ContextualSectionProps<"NationalCurriculumInsightsImageTextSection">) => {
  const headingId = useId();

  if (data.route.kind === "guidance") {
    return (
      <GuidanceExplainerSection
        as="section"
        $background="bg-decorative1-very-subdued"
        $ph="spacing-40"
        $pv={["spacing-48", "spacing-64", "spacing-40"]}
        aria-labelledby={headingId}
        data-insights-module="guidance-benefits"
      >
        <GuidanceExplainerLayout $mh="auto">
          <GuidanceExplainerHeading tag="h2" id={headingId} $font="heading-5">
            {section.heading}
          </GuidanceExplainerHeading>
          <GuidanceExplainerImage
            aria-hidden={section.image.isPresentational || undefined}
            $mirror={section.mirrorImage ?? false}
          >
            <OakImage
              src={imageUrl(section.image)}
              alt={imageAlt(section.image)}
              $width="100%"
              $height="100%"
              $objectFit="contain"
            />
          </GuidanceExplainerImage>
          <GuidanceExplainerBody>
            <PortableTextWithDefaults
              value={section.bodyPortableText}
              components={guidancePortableTextComponents}
            />
          </GuidanceExplainerBody>
        </GuidanceExplainerLayout>
      </GuidanceExplainerSection>
    );
  }

  return (
    <EditorialSection
      as="section"
      $background={editorialBackground[section.background]}
      $ph={["spacing-20", "spacing-40"]}
      $pv={["spacing-48", "spacing-64"]}
      aria-labelledby={headingId}
    >
      <SectionMaxWidth $mh="auto">
        <OakFlex
          $flexDirection={[
            "column",
            "column",
            section.imagePosition === "left" ? "row" : "row-reverse",
          ]}
          $alignItems="center"
          $gap={["spacing-32", "spacing-64"]}
        >
          <EditorialImage
            $borderRadius="border-radius-m2"
            aria-hidden={section.image.isPresentational || undefined}
          >
            <OakImage
              src={imageUrl(section.image)}
              alt={imageAlt(section.image)}
              $width="100%"
              $height="100%"
              $objectFit="cover"
            />
          </EditorialImage>
          <EditorialCopy $flexDirection="column" $gap="spacing-24">
            <OakHeading
              tag="h2"
              id={headingId}
              $font={["heading-4", "heading-3"]}
            >
              {section.heading}
            </OakHeading>
            <PortableTextWithDefaults
              value={section.bodyPortableText}
              components={portableTextComponents}
            />
            {section.ctaLabel && section.ctaHref ? (
              <OakLink href={section.ctaHref} iconName="arrow-right">
                {section.ctaLabel}
              </OakLink>
            ) : null}
          </EditorialCopy>
        </OakFlex>
      </SectionMaxWidth>
    </EditorialSection>
  );
};
