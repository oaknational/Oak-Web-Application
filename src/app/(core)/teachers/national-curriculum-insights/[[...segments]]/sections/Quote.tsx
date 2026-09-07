"use client";

import { getMediaQuery, OakBox, OakQuote } from "@oaknational/oak-components";
import styled from "styled-components";

import { SectionProps } from "./shared";

import getProxiedSanityAssetUrl from "@/common-lib/urls/getProxiedSanityAssetUrl";

const GuidanceQuoteSection = styled(OakBox)`
  box-sizing: border-box;

  @media (${getMediaQuery("mobile")}) {
    display: none;
  }

  @media (${getMediaQuery("desktop")}) {
    height: 418px;
    display: flex;
    align-items: center;
  }
`;

const GuidanceQuoteCard = styled(OakBox)`
  box-sizing: border-box;
  width: 100%;
  max-width: 800px;

  img {
    width: 54px;
    height: 54px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

export const NationalCurriculumInsightsQuote = ({
  section,
}: SectionProps<"NationalCurriculumInsightsQuoteSection">) => {
  const authorImageSrc = section.image?.asset?.url
    ? getProxiedSanityAssetUrl(section.image.asset.url)
    : undefined;

  return (
    <GuidanceQuoteSection
      as="section"
      $ph={["spacing-16", "spacing-40"]}
      $pv="spacing-40"
      data-insights-module="guidance-testimonial"
    >
      <GuidanceQuoteCard
        $mh="auto"
        $background="bg-decorative1-very-subdued"
        $pa={["spacing-24", "spacing-48"]}
      >
        <OakQuote
          quote={section.quote}
          authorName={section.attribution}
          authorTitle={section.role ?? undefined}
          authorImageSrc={authorImageSrc}
          color="bg-inverted-semi-transparent"
          hasLeftBorder
        />
      </GuidanceQuoteCard>
    </GuidanceQuoteSection>
  );
};
