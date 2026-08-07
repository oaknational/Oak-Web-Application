"use client";

import type { PortableTextComponents } from "@portabletext/react";
import {
  getMediaQuery,
  OakBox,
  OakBreadcrumbs,
  OakFlex,
  OakHeading,
  OakImage,
  OakInlineBanner,
  OakP,
} from "@oaknational/oak-components";
import styled from "styled-components";

import type { NationalCurriculumInsightsRouteData } from "./getNationalCurriculumInsightsData";

import type { NationalCurriculumInsightsHeroSection } from "@/common-lib/cms-types/nationalCurriculumInsights";
import {
  nationalCurriculumInsightsHubHref,
  nationalCurriculumInsightsSubjectHref,
  nationalCurriculumInsightsSubjectPhaseHref,
} from "@/common-lib/urls/nationalCurriculumInsights";
import getProxiedSanityAssetUrl from "@/common-lib/urls/getProxiedSanityAssetUrl";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";

const DEFAULT_HERO_IMAGE = "/images/national-curriculum-insights/hero.jpg";

type HeroPageKind = "hub" | "subject" | "phase";

const HeroSection = styled(OakBox)<{ $pageKind: HeroPageKind }>`
  @media (${getMediaQuery("desktop")}) {
    min-height: ${({ $pageKind }) =>
      $pageKind === "hub"
        ? "439px"
        : $pageKind === "subject"
          ? "770px"
          : "654px"};
    display: flex;
    align-items: center;
  }
`;

const HeroContent = styled(OakFlex)`
  width: 100%;
  max-width: 1222px;
`;

const HeroCopyColumn = styled(OakFlex)`
  width: 100%;

  @media (${getMediaQuery("desktop")}) {
    width: 740px;
    flex-shrink: 0;
    padding-bottom: 40px;
  }
`;

const HeroTextColumn = styled(OakFlex)<{ $pageKind: HeroPageKind }>`
  width: 100%;

  @media (${getMediaQuery("desktop")}) {
    width: 807px;
    min-height: ${({ $pageKind }) =>
      $pageKind === "subject"
        ? "600px"
        : $pageKind === "phase"
          ? "484px"
          : "auto"};
    justify-content: ${({ $pageKind }) =>
      $pageKind === "hub" ? "flex-start" : "space-between"};
  }
`;

const HeroCopy = styled(OakFlex)`
  width: 100%;
  max-width: 650px;
`;

const HeroImageContainer = styled(OakFlex)`
  width: 100%;
  aspect-ratio: 3 / 2;

  @media (${getMediaQuery("desktop")}) {
    width: 466px;
    height: 311px;
    flex-shrink: 0;
  }
`;

const AuthorImage = styled(OakBox)`
  position: relative;
  flex: 0 0 54px;
  width: 54px;
  height: 54px;
  overflow: hidden;
`;

const heroPortableTextComponents: PortableTextComponents = {
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

  if (route.kind === "hub" || !data.subject) {
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
      breadcrumbs.push({
        href: nationalCurriculumInsightsSubjectPhaseHref(
          data.subject.slug,
          route.phase,
        ),
        text: phaseLabel,
      });
      breadcrumbs.push({
        text: `Key stage ${route.keyStageSlug.slice("key-stage-".length)}`,
      });
    }
  }

  return breadcrumbs as Parameters<typeof OakBreadcrumbs>[0]["breadcrumbs"];
};

export const NationalCurriculumInsightsHero = ({
  data,
  section,
}: {
  data: NationalCurriculumInsightsRouteData;
  section: NationalCurriculumInsightsHeroSection;
}) => {
  const isHub = data.route.kind === "hub";
  const pageKind: HeroPageKind = isHub
    ? "hub"
    : data.route.kind === "subject"
      ? "subject"
      : "phase";
  const breadcrumbs = heroBreadcrumbs(data);
  const imageUrl = section.image.asset?.url
    ? getProxiedSanityAssetUrl(section.image.asset.url)
    : DEFAULT_HERO_IMAGE;
  const imageAlt = section.image.isPresentational
    ? ""
    : (section.image.altText ?? "");
  const authorImageUrl = section.authorImage?.asset?.url
    ? getProxiedSanityAssetUrl(section.authorImage.asset.url)
    : null;
  const showPageMeta =
    !isHub && Boolean(section.authorName || section.statusMessage);

  return (
    <HeroSection
      $pageKind={pageKind}
      as="section"
      $background="bg-decorative2-very-subdued"
      $ph={["spacing-20", "spacing-40", "spacing-40"]}
      $pv={["spacing-40", "spacing-40", "spacing-64"]}
      data-testid="national-curriculum-insights-hero"
    >
      <HeroContent
        $mh="auto"
        $alignItems={["stretch", "stretch", "center"]}
        $flexDirection={["column", "column", "row"]}
        $gap={["spacing-32", "spacing-32", "spacing-16"]}
      >
        <HeroTextColumn
          $pageKind={pageKind}
          $order={[2, 2, 1]}
          $flexDirection="column"
          $gap={breadcrumbs ? "spacing-48" : "spacing-0"}
        >
          {breadcrumbs ? <OakBreadcrumbs breadcrumbs={breadcrumbs} /> : null}
          <HeroCopyColumn $alignItems={["stretch", "stretch", "flex-start"]}>
            <HeroCopy $flexDirection="column" $gap="spacing-24">
              <OakHeading
                tag="h1"
                $font={["heading-4", "heading-4", "heading-1"]}
              >
                {section.heading}
              </OakHeading>
              <PortableTextWithDefaults
                value={section.bodyPortableText}
                components={heroPortableTextComponents}
              />
            </HeroCopy>
          </HeroCopyColumn>
          {showPageMeta ? (
            <OakFlex
              $flexDirection={
                data.route.kind === "subject"
                  ? "column"
                  : ["column", "column", "row"]
              }
              $alignItems={
                data.route.kind === "subject"
                  ? "flex-start"
                  : ["stretch", "stretch", "center"]
              }
              $justifyContent={
                data.route.kind === "subject" ? "flex-start" : "space-between"
              }
              $gap="spacing-24"
            >
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
              {section.statusMessage ? (
                <OakInlineBanner
                  isOpen
                  type="info"
                  message={section.statusMessage}
                  $maxWidth="spacing-480"
                />
              ) : null}
            </OakFlex>
          ) : null}
        </HeroTextColumn>

        {isHub ? (
          <HeroImageContainer
            $order={[1, 1, 2]}
            $overflow="hidden"
            aria-hidden={section.image.isPresentational ? true : undefined}
          >
            <OakImage
              src={imageUrl}
              alt={imageAlt}
              $width="100%"
              $height="100%"
              $objectFit="cover"
              priority
            />
          </HeroImageContainer>
        ) : null}
      </HeroContent>
    </HeroSection>
  );
};
