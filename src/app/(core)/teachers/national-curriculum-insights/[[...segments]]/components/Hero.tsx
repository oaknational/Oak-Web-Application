"use client";

import type { PortableTextComponents } from "@portabletext/react";
import {
  OakBox,
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakImage,
  OakLink,
  OakP,
} from "@oaknational/oak-components";

import type { NationalCurriculumInsightsRouteData } from "../helpers/getRouteData";
import { nationalCurriculumInsightsPresentation } from "../helpers/presentation";
import { insightsAssetUrl } from "../helpers/assets";

import { NationalCurriculumInsightsPortableText as PortableTextWithDefaults } from "./PortableText";
import { NationalCurriculumInsightsHeader } from "./InsightHeader";
import { SectionMaxWidth } from "./sections/shared";

import type { NationalCurriculumInsightsHeroSection } from "@/common-lib/cms-types/nationalCurriculumInsights";
import getProxiedSanityAssetUrl from "@/common-lib/urls/getProxiedSanityAssetUrl";

const DEFAULT_HERO_IMAGE = insightsAssetUrl("hero");

type HeroPageKind = "hub" | "guidance";

const heroPortableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <OakP $font="body-2" $mv="spacing-0">
        {children}
      </OakP>
    ),
  },
};

const guidanceHeroPortableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <OakP $font="body-1" $mv="spacing-0">
        {children}
      </OakP>
    ),
  },
};

const getHeroResponsiveProps = (
  pageKind: HeroPageKind,
): {
  textOrder: [number, number, number];
  headingFont: [
    "heading-4",
    "heading-1" | "heading-3" | "heading-4",
    "heading-1" | "heading-3",
  ];
} => {
  if (pageKind === "hub") {
    return {
      textOrder: [2, 1, 1],
      headingFont: ["heading-4", "heading-4", "heading-1"],
    };
  }
  return {
    textOrder: [2, 2, 1],
    headingFont: ["heading-4", "heading-3", "heading-3"],
  };
};

const HubHeroImage = ({
  hasEditorialImage,
  isGuidance,
  section,
}: {
  hasEditorialImage: boolean;
  isGuidance: boolean;
  section: NationalCurriculumInsightsHeroSection;
}) => {
  if (!hasEditorialImage) {
    return null;
  }

  const imageUrl = section.image?.asset?.url
    ? getProxiedSanityAssetUrl(section.image.asset.url)
    : DEFAULT_HERO_IMAGE;
  const imageAlt = section.image?.isPresentational
    ? ""
    : (section.image?.altText ?? "");

  return (
    <OakFlex
      $width="100%"
      $maxWidth="spacing-480"
      $aspectRatio={isGuidance ? ["439 / 305", "3 / 2"] : "3 / 2"}
      $alignSelf="center"
      $mh="auto"
      $order={[1, 2, 2]}
      $overflow="hidden"
      aria-hidden={section.image?.isPresentational ? true : undefined}
    >
      {isGuidance ? (
        <OakBox
          $boxSizing="border-box"
          $position="relative"
          $width="100%"
          $height="100%"
          $ph={["spacing-0", "spacing-0", "spacing-24"]}
          $pv={["spacing-0", "spacing-0", "spacing-12"]}
        >
          <OakImage
            src={imageUrl}
            alt={imageAlt}
            $width="100%"
            $height="100%"
            $objectFit="contain"
          />
        </OakBox>
      ) : (
        <OakImage
          src={imageUrl}
          alt={imageAlt}
          $width="100%"
          $height="100%"
          $objectFit="cover"
        />
      )}
    </OakFlex>
  );
};

export const NationalCurriculumInsightsHero = ({
  data,
  section,
}: {
  data: NationalCurriculumInsightsRouteData;
  section: NationalCurriculumInsightsHeroSection;
}) => {
  if (data.route.kind !== "hub" && data.route.kind !== "guidance") {
    return <NationalCurriculumInsightsHeader data={data} section={section} />;
  }

  const isHub = data.route.kind === "hub";
  const hasEditorialImage = isHub || data.route.kind === "guidance";
  const pageKind = data.route.kind;
  const presentation = nationalCurriculumInsightsPresentation(data.route);
  const { textOrder, headingFont } = getHeroResponsiveProps(pageKind);

  return (
    <OakBox
      $boxSizing="border-box"
      $minHeight={
        pageKind === "guidance" ? ["auto", "auto", "spacing-480"] : "auto"
      }
      as="section"
      $background={presentation.heroBackground}
      $ph={["spacing-20", "spacing-40", "spacing-40"]}
      $pv={[
        "spacing-40",
        pageKind === "guidance" ? "spacing-64" : "spacing-40",
        "spacing-64",
      ]}
      data-testid="national-curriculum-insights-hero"
      data-insights-module="hero"
    >
      <SectionMaxWidth $mh="auto" $flexDirection="column" $gap="spacing-0">
        <OakGrid
          $gridTemplateColumns={[
            "minmax(0, 1fr)",
            hasEditorialImage
              ? "minmax(0, 5fr) minmax(0, 4fr)"
              : "repeat(3, minmax(0, 1fr))",
            "minmax(0, 8fr) minmax(0, 5fr)",
          ]}
          $alignItems={[
            "stretch",
            hasEditorialImage ? "center" : "start",
            hasEditorialImage ? "center" : "start",
          ]}
          $cg="spacing-16"
          $rg={["spacing-32", "spacing-24", "spacing-16"]}
        >
          <OakGridArea
            $colSpan={[1, hasEditorialImage ? 1 : 2, 1]}
            $order={textOrder}
            $flexDirection="column"
            $gap="spacing-0"
          >
            <OakFlex
              $width="100%"
              $maxWidth="spacing-640"
              $flexDirection="column"
              $gap="spacing-24"
              $pb={[
                "spacing-0",
                pageKind === "guidance" ? "spacing-40" : "spacing-0",
                "spacing-40",
              ]}
            >
              <OakHeading tag="h1" $font={headingFont}>
                {pageKind === "guidance" ? (
                  <>
                    <OakBox as="span" $display={["inline", "none"]}>
                      Changes to the national curriculum
                    </OakBox>
                    <OakBox as="span" $display={["none", "inline"]}>
                      {section.heading}
                    </OakBox>
                  </>
                ) : (
                  section.heading
                )}
              </OakHeading>
              <PortableTextWithDefaults
                value={section.bodyPortableText}
                components={
                  pageKind === "guidance"
                    ? guidanceHeroPortableTextComponents
                    : heroPortableTextComponents
                }
              />
              {section.ctaLabel && section.ctaHref ? (
                <OakLink href={section.ctaHref} iconName="arrow-right">
                  {section.ctaLabel}
                </OakLink>
              ) : null}
            </OakFlex>
          </OakGridArea>
          <HubHeroImage
            hasEditorialImage={hasEditorialImage}
            isGuidance={pageKind === "guidance"}
            section={section}
          />
        </OakGrid>
      </SectionMaxWidth>
    </OakBox>
  );
};
