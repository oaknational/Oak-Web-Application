"use client";

import {
  getBreakpoint,
  getMediaQuery,
  OakBox,
  OakFlex,
  OakGrid,
  OakHeading,
  OakImage,
  OakLink,
} from "@oaknational/oak-components";
import { useId } from "react";
import styled from "styled-components";

import { NationalCurriculumInsightsPortableText as PortableTextWithDefaults } from "../PortableText";

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

const editorialBackground = {
  white: "bg-primary",
  turquoise: "bg-decorative2-subdued",
  yellow: "bg-decorative5-very-subdued",
} as const;

const GuidanceExplainerSection = styled(OakBox)`
  @media (${getMediaQuery("desktop")}) {
    align-items: center;
  }

  @media ${insightsTabletMediaQuery} {
    min-height: auto;
    display: block;
  }
`;

const GuidanceExplainerLayout = styled(OakGrid)`
  @media (${getMediaQuery("desktop")}) {
    align-items: center;
  }

  @media ${insightsTabletMediaQuery} {
    width: clamp(670px, calc(58.302vw + 232.736px), 979px);
    max-width: 100%;
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto auto auto;
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
  justify-self: center;

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
        $boxSizing="border-box"
        $display={["block", "block", "flex"]}
        $minHeight={[null, null, "spacing-480"]}
        $background="bg-decorative1-very-subdued"
        $ph="spacing-40"
        $pv={["spacing-48", "spacing-64", "spacing-40"]}
        aria-labelledby={headingId}
        data-insights-module="guidance-benefits"
      >
        <GuidanceExplainerLayout
          $mh="auto"
          $maxWidth="1218px"
          $gridTemplateColumns={[
            "minmax(0, 1fr)",
            null,
            "684px minmax(0, 1fr)",
          ]}
          $gridTemplateRows={[null, null, "auto auto"]}
          $cg="spacing-40"
          $rg="spacing-40"
        >
          <GuidanceExplainerHeading tag="h2" id={headingId} $font="heading-5">
            {section.heading}
          </GuidanceExplainerHeading>
          <GuidanceExplainerImage
            $width="269px"
            $maxWidth="100%"
            $aspectRatio="332 / 259"
            $overflow="hidden"
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
    <OakFlex
      as="section"
      $display={["block", "block", "flex"]}
      $minHeight={[null, null, "452px"]}
      $alignItems="center"
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
          <OakBox
            $width={["100%", "100%", "50%"]}
            $aspectRatio="16 / 10"
            $overflow="hidden"
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
          </OakBox>
          <OakFlex
            $width={["100%", "100%", "50%"]}
            $flexDirection="column"
            $gap="spacing-24"
          >
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
          </OakFlex>
        </OakFlex>
      </SectionMaxWidth>
    </OakFlex>
  );
};
