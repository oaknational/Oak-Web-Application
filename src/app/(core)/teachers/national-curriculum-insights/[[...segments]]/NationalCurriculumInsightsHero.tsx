"use client";

import type { PortableTextComponents } from "@portabletext/react";
import {
  getMediaQuery,
  OakBox,
  OakBreadcrumbs,
  OakFlex,
  OakHeading,
  OakImage,
  OakP,
} from "@oaknational/oak-components";
import styled from "styled-components";

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

type HeroPageKind = "hub" | "subject" | "phase" | "keyStage";

const heroSectionMinHeight = ({ $pageKind }: { $pageKind: HeroPageKind }) => {
  switch ($pageKind) {
    case "hub":
      return "439px";
    case "subject":
    case "phase":
    case "keyStage":
      return "590px";
  }
};

const HeroSection = styled(OakBox)<{ $pageKind: HeroPageKind }>`
  box-sizing: border-box;

  @media (${getMediaQuery("desktop")}) {
    height: ${heroSectionMinHeight};
    display: flex;
    align-items: flex-start;
  }
`;

const HeroContent = styled(OakFlex)`
  width: 100%;
  max-width: 1221px;
`;

const HeroMain = styled(OakFlex)`
  width: 100%;
`;

const HeroTextColumn = styled(OakFlex)<{ $pageKind: HeroPageKind }>`
  width: 100%;

  @media (${getMediaQuery("desktop")}) {
    width: ${({ $pageKind }) => ($pageKind === "hub" ? "740px" : "786px")};
    flex-shrink: 0;
  }
`;

const HeroCopyColumn = styled(OakFlex)`
  width: 100%;

  @media (${getMediaQuery("desktop")}) {
    width: 740px;
    flex-shrink: 0;
  }
`;

const HeroCopy = styled(OakFlex)`
  width: 100%;
  max-width: 650px;

  @media (${getMediaQuery("desktop")}) {
    padding-bottom: 40px;
  }
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

const UpdateCard = styled(OakBox)`
  box-sizing: border-box;
  width: 100%;
  border: 1px solid #7cd8d0;

  @media (${getMediaQuery("desktop")}) {
    width: 408px;
    flex: 0 0 408px;
    order: 2;
    margin-top: 36px;
  }
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
        <OakP $font="heading-7" $mv="spacing-0">
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
  isHub,
  section,
}: {
  isHub: boolean;
  section: NationalCurriculumInsightsHeroSection;
}) => {
  if (!isHub) {
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
      $order={[1, 1, 2]}
      $overflow="hidden"
      aria-hidden={section.image?.isPresentational ? true : undefined}
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
  const pageKind = getHeroPageKind(data);
  const breadcrumbs = heroBreadcrumbs(data);
  const presentation = nationalCurriculumInsightsPresentation(data.route);

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
        $gap={breadcrumbs ? "spacing-48" : "spacing-0"}
      >
        {breadcrumbs ? <OakBreadcrumbs breadcrumbs={breadcrumbs} /> : null}
        <HeroMain
          $alignItems={["stretch", "stretch", isHub ? "center" : "flex-start"]}
          $flexDirection={["column", "column", "row"]}
          $justifyContent="space-between"
          $gap={["spacing-32", "spacing-32", "spacing-16"]}
        >
          <HeroTextColumn
            $pageKind={pageKind}
            $order={[2, 2, 1]}
            $flexDirection="column"
            $gap="spacing-0"
          >
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
                <HeroPageMeta data={data} section={section} />
              </HeroCopy>
            </HeroCopyColumn>
          </HeroTextColumn>
          {isHub ? (
            <HubHeroImage isHub section={section} />
          ) : (
            <HeroUpdateCard section={section} />
          )}
        </HeroMain>
      </HeroContent>
    </HeroSection>
  );
};
