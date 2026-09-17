"use client";

import type { PortableTextComponents } from "@portabletext/react";
import {
  OakBox,
  OakBreadcrumbs,
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
import { SectionMaxWidth } from "./sections/shared";

import type { NationalCurriculumInsightsHeroSection } from "@/common-lib/cms-types/nationalCurriculumInsights";
import {
  nationalCurriculumInsightsHubHref,
  nationalCurriculumInsightsSubjectHref,
  nationalCurriculumInsightsSubjectPhaseHref,
} from "@/common-lib/urls/nationalCurriculumInsights";
import getProxiedSanityAssetUrl from "@/common-lib/urls/getProxiedSanityAssetUrl";

const DEFAULT_HERO_IMAGE = insightsAssetUrl("hero");

type HeroPageKind = "hub" | "guidance" | "subject" | "phase" | "keyStage";

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

const heroBreadcrumbs = (data: NationalCurriculumInsightsRouteData) => {
  const route = data.route;

  if (
    route.kind === "hub" ||
    route.kind === "guidance" ||
    !data.subject ||
    !data.hub
  ) {
    return null;
  }

  const breadcrumbs: Array<{ href?: string; text: string }> = [
    {
      href: nationalCurriculumInsightsHubHref(),
      text: data.hub.title,
    },
  ];

  if (route.kind === "subject") {
    breadcrumbs.push({ text: data.subject.title });
  } else {
    breadcrumbs.push({
      href: nationalCurriculumInsightsSubjectHref(data.subject.slug),
      text: data.subject.title,
    });

    const phaseLabel =
      data.subject.tabs.find(({ kind }) => kind === route.phase)?.label ??
      route.phase;

    if (route.kind === "subjectPhase") {
      breadcrumbs.push({ text: phaseLabel });
    } else {
      breadcrumbs.push(
        {
          href: nationalCurriculumInsightsSubjectPhaseHref(
            data.subject.slug,
            route.phase,
          ),
          text: phaseLabel,
        },
        {
          text: `Key stage ${route.keyStageSlug.slice("key-stage-".length)}`,
        },
      );
    }
  }

  return breadcrumbs as Parameters<typeof OakBreadcrumbs>[0]["breadcrumbs"];
};

const getHeroPageKind = (
  data: NationalCurriculumInsightsRouteData,
): HeroPageKind => {
  switch (data.route.kind) {
    case "hub":
      return "hub";
    case "guidance":
      return "guidance";
    case "subject":
      return "subject";
    case "subjectPhase":
      return "phase";
    case "subjectPhaseKeyStage":
      return "keyStage";
  }
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
  if (pageKind === "guidance") {
    return {
      textOrder: [2, 2, 1],
      headingFont: ["heading-4", "heading-3", "heading-3"],
    };
  }
  return {
    textOrder: [1, 1, 1],
    headingFont: ["heading-4", "heading-1", "heading-1"],
  };
};

const optionalImageUrl = (
  image: NationalCurriculumInsightsHeroSection["authorImage"],
) => (image?.asset?.url ? getProxiedSanityAssetUrl(image.asset.url) : null);

const HeroPageMeta = ({
  data,
  section,
}: {
  data: NationalCurriculumInsightsRouteData;
  section: NationalCurriculumInsightsHeroSection;
}) => {
  if (
    data.route.kind === "hub" ||
    data.route.kind === "guidance" ||
    (!section.authorName && !section.statusMessage)
  ) {
    return null;
  }

  const authorImageUrl = optionalImageUrl(section.authorImage);

  return (
    <OakFlex $flexDirection="column" $gap="spacing-24">
      {section.authorName ? (
        <OakFlex $alignItems="center" $gap="spacing-12">
          {authorImageUrl ? (
            <OakBox
              $position="relative"
              $flexShrink={0}
              $width="spacing-56"
              $height="spacing-56"
              $overflow="hidden"
              $borderRadius="border-radius-circle"
            >
              <OakImage
                src={authorImageUrl}
                alt={section.authorImage?.altText ?? ""}
                $width="100%"
                $height="100%"
                $objectFit="cover"
              />
            </OakBox>
          ) : null}
          <OakFlex $flexDirection="column" $gap="spacing-4">
            <OakP $font="heading-7" $mv="spacing-0">
              {section.authorName}
            </OakP>
            {section.authorRole ? (
              <OakP $font="body-3" $mv="spacing-0">
                {section.authorRole}
              </OakP>
            ) : null}
          </OakFlex>
        </OakFlex>
      ) : null}
    </OakFlex>
  );
};

const HeroUpdateCard = ({
  section,
}: {
  section: NationalCurriculumInsightsHeroSection;
}) =>
  section.statusMessage ? (
    <OakBox
      $boxSizing="border-box"
      $width="100%"
      $mt={["spacing-0", "spacing-0", "spacing-32"]}
      $ba="border-solid-s"
      $borderColor="border-decorative2-stronger"
      $background="bg-primary"
      $borderRadius="border-radius-m2"
      $pa="spacing-16"
    >
      <OakFlex $flexDirection="column" $gap="spacing-4">
        <OakP $font="body-2-bold" $mv="spacing-0">
          {section.statusHeading ??
            "This page was last updated on July 7, 2026"}
        </OakP>
        <OakP $font="body-2" $mv="spacing-0">
          {section.statusMessage}
        </OakP>
      </OakFlex>
    </OakBox>
  ) : null;

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
            priority
          />
        </OakBox>
      ) : (
        <OakImage
          src={imageUrl}
          alt={imageAlt}
          $width="100%"
          $height="100%"
          $objectFit="cover"
          priority
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
  const isHub = data.route.kind === "hub";
  const hasEditorialImage = isHub || data.route.kind === "guidance";
  const pageKind = getHeroPageKind(data);
  const breadcrumbs = heroBreadcrumbs(data);
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
      <SectionMaxWidth
        $mh="auto"
        $flexDirection="column"
        $gap={
          breadcrumbs ? ["spacing-48", "spacing-20", "spacing-48"] : "spacing-0"
        }
      >
        {breadcrumbs ? <OakBreadcrumbs breadcrumbs={breadcrumbs} /> : null}
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
              <HeroPageMeta data={data} section={section} />
            </OakFlex>
          </OakGridArea>
          {hasEditorialImage ? (
            <HubHeroImage
              hasEditorialImage={hasEditorialImage}
              isGuidance={pageKind === "guidance"}
              section={section}
            />
          ) : (
            <OakGridArea $colSpan={[1, 2, 1]}>
              <HeroUpdateCard section={section} />
            </OakGridArea>
          )}
        </OakGrid>
      </SectionMaxWidth>
    </OakBox>
  );
};
