"use client";

import type { PortableTextComponents } from "@portabletext/react";
import {
  OakBox,
  OakFlex,
  OakHeading,
  OakImage,
  OakMaxWidth,
  OakP,
  type OakUiRoleToken,
} from "@oaknational/oak-components";
import { useId } from "react";

import { NationalCurriculumInsightsPortableText } from "../PortableText";

import type { ContextualSectionProps } from "./shared";

import getProxiedSanityAssetUrl from "@/common-lib/urls/getProxiedSanityAssetUrl";

const bodyComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <OakP $font="body-1" $mv="spacing-0">
        {children}
      </OakP>
    ),
  },
};

const panelColours = {
  subject: {
    border: "border-decorative5-stronger",
    accent: "bg-decorative5-main",
  },
  subjectPhase: {
    border: "border-decorative1-stronger",
    accent: "bg-decorative1-main",
  },
  subjectPhaseKeyStage: {
    border: "border-decorative3-stronger",
    accent: "bg-decorative3-main",
  },
} as const satisfies Record<
  string,
  { border: OakUiRoleToken; accent: OakUiRoleToken }
>;

export const NationalCurriculumInsightsHeadlines = ({
  data,
  section,
}: ContextualSectionProps<"NationalCurriculumInsightsOverviewSection">) => {
  const headingId = useId();
  if (data.route.kind === "hub" || data.route.kind === "guidance") return null;

  const colours = panelColours[data.route.kind];
  const quote = section.quote;
  const portraitUrl = quote?.image?.asset?.url
    ? getProxiedSanityAssetUrl(quote.image.asset.url)
    : null;

  return (
    <OakBox
      $boxSizing="border-box"
      $ph={["spacing-24", "spacing-40"]}
      $pv={["spacing-32", "spacing-48"]}
    >
      <OakMaxWidth
        as="section"
        $boxSizing="border-box"
        $width="100%"
        $maxWidth="spacing-1280"
        $ma="auto"
        $background="bg-primary"
        $color="text-primary"
        $ph={["spacing-20", "spacing-40"]}
        $pv="spacing-40"
        $ba="border-solid-s"
        $borderColor={colours.border}
        $borderRadius="border-radius-m2"
        $gap="spacing-24"
        aria-labelledby={headingId}
        data-insights-module="overview"
      >
        <OakHeading id={headingId} tag="h2" $font="heading-4">
          {section.heading}
        </OakHeading>
        <OakFlex $flexDirection="column" $gap="spacing-24">
          <NationalCurriculumInsightsPortableText
            value={section.bodyPortableText}
            components={bodyComponents}
          />
        </OakFlex>
        {quote ? (
          <OakFlex as="blockquote" $ma="spacing-0" $gap="spacing-24">
            <OakFlex
              $width="spacing-8"
              $flexShrink={0}
              $background={colours.accent}
              aria-hidden="true"
            />
            <OakFlex
              $flexDirection="column"
              $gap="spacing-20"
              $minWidth="spacing-0"
            >
              <OakP $font="body-1-bold" $mv="spacing-0">
                {quote.quote}
              </OakP>
              <OakFlex $alignItems="center" $gap="spacing-12">
                {portraitUrl ? (
                  <OakImage
                    src={portraitUrl}
                    alt=""
                    $width="spacing-56"
                    $height="spacing-56"
                    $minWidth="spacing-56"
                    $borderRadius="border-radius-circle"
                    $overflow="hidden"
                    $objectFit="cover"
                    sizes="56px"
                  />
                ) : null}
                <OakFlex $flexDirection="column" $minWidth="spacing-0">
                  <OakP $font="body-2-bold" $mv="spacing-0">
                    {quote.attribution}
                  </OakP>
                  {quote.role ? (
                    <OakP $font="body-2" $mv="spacing-0">
                      {quote.role}
                    </OakP>
                  ) : null}
                </OakFlex>
              </OakFlex>
            </OakFlex>
          </OakFlex>
        ) : null}
      </OakMaxWidth>
    </OakBox>
  );
};
