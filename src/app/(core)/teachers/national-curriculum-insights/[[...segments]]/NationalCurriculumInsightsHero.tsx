"use client";

import type { PortableTextComponents } from "@portabletext/react";
import {
  getBreakpoint,
  getMediaQuery,
  OakBox,
  OakBreadcrumbs,
  OakFlex,
  OakHeading,
  OakImage,
  OakLink,
  OakP,
  parseColor,
} from "@oaknational/oak-components";
import styled, { css } from "styled-components";

import type { NationalCurriculumInsightsRouteData } from "./getNationalCurriculumInsightsData";
import { nationalCurriculumInsightsPresentation } from "./nationalCurriculumInsightsPresentation";

import type { NationalCurriculumInsightsHeroSection } from "@/common-lib/cms-types/nationalCurriculumInsights";
import {
  nationalCurriculumInsightsHubHref,
  nationalCurriculumInsightsSubjectHref,
  nationalCurriculumInsightsSubjectPhaseHref,
} from "@/common-lib/urls/nationalCurriculumInsights";
import getProxiedSanityAssetUrl from "@/common-lib/urls/getProxiedSanityAssetUrl";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";

const DEFAULT_HERO_IMAGE = "/images/national-curriculum-insights/hero.jpg";

type HeroPageKind = "hub" | "guidance" | "subject" | "phase" | "keyStage";

const insightsTabletMediaQuery = `(min-width: ${getBreakpoint(
  "small",
)}px) and (max-width: ${getBreakpoint("large")}px)`;

const tabletGridEightColumns = "calc(66.6667% - 5.333px)";

const heroSectionMinHeight = ({ $pageKind }: { $pageKind: HeroPageKind }) => {
  switch ($pageKind) {
    case "hub":
      return "439px";
    case "guidance":
      return "480px";
    case "subject":
    case "phase":
    case "keyStage":
      return "auto";
  }
};

const HeroSection = styled(OakBox)<{ $pageKind: HeroPageKind }>`
  box-sizing: border-box;

  @media (${getMediaQuery("desktop")}) {
    height: ${heroSectionMinHeight};
    display: flex;
    align-items: flex-start;
  }

  @media ${insightsTabletMediaQuery} {
    ${({ $pageKind }) =>
      $pageKind !== "hub" &&
      $pageKind !== "guidance" &&
      css`
        height: auto;
        display: block;
      `}
  }
`;

const HeroContent = styled(OakFlex)`
  width: 100%;
  max-width: 1221px;
`;

const heroMainTabletStyles = ({ $pageKind }: { $pageKind: HeroPageKind }) => {
  if ($pageKind === "hub") {
    return css`
      flex-direction: row;
      align-items: center;
      gap: 24px;
    `;
  }

  if ($pageKind !== "guidance") {
    return css`
      flex-direction: column;
      align-items: stretch;
      gap: 24px;
    `;
  }

  return null;
};

const HeroMain = styled(OakFlex)<{ $pageKind: HeroPageKind }>`
  width: 100%;

  @media ${insightsTabletMediaQuery} {
    ${heroMainTabletStyles}
  }
`;

const heroTextColumnTabletStyles = ({
  $pageKind,
}: {
  $pageKind: HeroPageKind;
}) => {
  if ($pageKind === "hub") {
    return css`
      width: calc(58.3333% - 12px);
      flex-shrink: 1;
    `;
  }

  if ($pageKind !== "guidance") {
    return css`
      width: ${tabletGridEightColumns};
      flex-shrink: 1;
    `;
  }

  return null;
};

const HeroTextColumn = styled(OakFlex)<{ $pageKind: HeroPageKind }>`
  width: 100%;

  @media (${getMediaQuery("desktop")}) {
    width: ${({ $pageKind }) =>
      $pageKind === "hub" || $pageKind === "guidance" ? "740px" : "786px"};
    flex-shrink: 0;
  }

  @media ${insightsTabletMediaQuery} {
    ${heroTextColumnTabletStyles}
  }
`;

const HeroCopyColumn = styled(OakFlex)<{ $pageKind: HeroPageKind }>`
  width: 100%;

  @media (${getMediaQuery("desktop")}) {
    width: 740px;
    flex-shrink: 0;
  }

  @media ${insightsTabletMediaQuery} {
    ${({ $pageKind }) =>
      $pageKind !== "hub" &&
      css`
        width: 100%;
        flex-shrink: 1;
      `}
  }
`;

const HeroCopy = styled(OakFlex)<{ $pageKind: HeroPageKind }>`
  width: 100%;
  max-width: 650px;

  @media (${getMediaQuery("desktop")}) {
    padding-bottom: 40px;
  }

  @media ${insightsTabletMediaQuery} {
    ${({ $pageKind }) =>
      $pageKind !== "hub" &&
      css`
        max-width: none;
        padding-bottom: 0;
      `}
  }
`;

const HeroImageContainer = styled(OakFlex)<{ $sideBySideTablet: boolean }>`
  width: 100%;
  aspect-ratio: 3 / 2;

  @media ${insightsTabletMediaQuery} {
    ${({ $sideBySideTablet }) =>
      $sideBySideTablet &&
      css`
        width: calc(41.6667% - 12px);
        flex: 0 0 calc(41.6667% - 12px);
      `}
  }

  @media (${getMediaQuery("desktop")}) {
    width: 466px;
    height: 311px;
    flex-shrink: 0;
  }
`;

const GuidanceHeroImageFrame = styled(OakBox)`
  position: relative;
  width: 100%;
  height: 100%;

  @media (${getMediaQuery("desktop")}) {
    width: 416px;
    height: 289px;
    margin: auto;
  }
`;

const AuthorImage = styled(OakBox)`
  position: relative;
  flex: 0 0 54px;
  width: 54px;
  height: 54px;
  overflow: hidden;
`;

const UpdateCard = styled(OakBox)`
  box-sizing: border-box;
  width: 100%;
  order: 2;
  border: 1px solid ${parseColor("border-decorative2-stronger")};

  @media (${getMediaQuery("desktop")}) {
    width: 408px;
    flex: 0 0 408px;
    order: 2;
    margin-top: 36px;
  }

  @media ${insightsTabletMediaQuery} {
    width: ${tabletGridEightColumns};
    flex: 0 1 auto;
    order: 2;
    margin-top: 0;
  }
`;

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

  if (route.kind === "hub" || route.kind === "guidance" || !data.subject) {
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
            <AuthorImage $borderRadius="border-radius-circle">
              <OakImage
                src={authorImageUrl}
                alt={section.authorImage?.altText ?? ""}
                $width="100%"
                $height="100%"
                $objectFit="cover"
              />
            </AuthorImage>
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
    <UpdateCard
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
    </UpdateCard>
  ) : null;

const HubHeroImage = ({
  hasEditorialImage,
  isGuidance,
  sideBySideTablet,
  section,
}: {
  hasEditorialImage: boolean;
  isGuidance: boolean;
  sideBySideTablet: boolean;
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
    <HeroImageContainer
      $sideBySideTablet={sideBySideTablet}
      $order={[1, 2, 2]}
      $overflow="hidden"
      aria-hidden={section.image?.isPresentational ? true : undefined}
    >
      {isGuidance ? (
        <GuidanceHeroImageFrame>
          <OakImage
            src={imageUrl}
            alt={imageAlt}
            $width="100%"
            $height="100%"
            $objectFit="contain"
            priority
          />
        </GuidanceHeroImageFrame>
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
    </HeroImageContainer>
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
  let heroTextOrder: [number, number, number] = [1, 1, 1];
  let heroHeadingFont:
    | "heading-3"
    | ["heading-4", "heading-4", "heading-1"]
    | ["heading-4", "heading-1", "heading-1"] = [
    "heading-4",
    "heading-1",
    "heading-1",
  ];

  if (isHub) {
    heroTextOrder = [2, 1, 1];
  } else if (hasEditorialImage) {
    heroTextOrder = [2, 2, 1];
  }

  if (pageKind === "guidance") {
    heroHeadingFont = "heading-3";
  } else if (hasEditorialImage) {
    heroHeadingFont = ["heading-4", "heading-4", "heading-1"];
  }

  return (
    <HeroSection
      $pageKind={pageKind}
      as="section"
      $background={presentation.heroBackground}
      $ph={["spacing-20", "spacing-40", "spacing-40"]}
      $pv={["spacing-40", "spacing-40", "spacing-64"]}
      data-testid="national-curriculum-insights-hero"
      data-insights-module="hero"
    >
      <HeroContent
        $mh="auto"
        $flexDirection="column"
        $gap={
          breadcrumbs ? ["spacing-48", "spacing-20", "spacing-48"] : "spacing-0"
        }
      >
        {breadcrumbs ? <OakBreadcrumbs breadcrumbs={breadcrumbs} /> : null}
        <HeroMain
          $pageKind={pageKind}
          $alignItems={[
            "stretch",
            "stretch",
            hasEditorialImage ? "center" : "flex-start",
          ]}
          $flexDirection={["column", "column", "row"]}
          $justifyContent="space-between"
          $gap={["spacing-32", "spacing-32", "spacing-16"]}
        >
          <HeroTextColumn
            $pageKind={pageKind}
            $order={heroTextOrder}
            $flexDirection="column"
            $gap="spacing-0"
          >
            <HeroCopyColumn
              $pageKind={pageKind}
              $alignItems={["stretch", "stretch", "flex-start"]}
            >
              <HeroCopy
                $pageKind={pageKind}
                $flexDirection="column"
                $gap="spacing-24"
              >
                <OakHeading tag="h1" $font={heroHeadingFont}>
                  {section.heading}
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
              </HeroCopy>
            </HeroCopyColumn>
          </HeroTextColumn>
          {hasEditorialImage ? (
            <HubHeroImage
              hasEditorialImage={hasEditorialImage}
              isGuidance={pageKind === "guidance"}
              sideBySideTablet={isHub}
              section={section}
            />
          ) : (
            <HeroUpdateCard section={section} />
          )}
        </HeroMain>
      </HeroContent>
    </HeroSection>
  );
};
