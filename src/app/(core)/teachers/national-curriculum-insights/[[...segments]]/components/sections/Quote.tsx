"use client";

import { OakBox, OakQuote } from "@oaknational/oak-components";
import styled from "styled-components";

import { SectionProps } from "./shared";

import getProxiedSanityAssetUrl from "@/common-lib/urls/getProxiedSanityAssetUrl";

const GuidanceQuoteCard = styled(OakBox)`
  img {
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
    <OakBox
      $boxSizing="border-box"
      $display={["none", "block"]}
      as="section"
      $ph={["spacing-16", "spacing-40"]}
      $pv="spacing-40"
      data-insights-module="guidance-testimonial"
    >
      <GuidanceQuoteCard
        $boxSizing="border-box"
        $width="100%"
        $maxWidth="spacing-800"
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
    </OakBox>
  );
};
