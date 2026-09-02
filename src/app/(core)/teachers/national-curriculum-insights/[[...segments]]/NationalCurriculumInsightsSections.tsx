"use client";

import type { PortableTextComponents } from "@portabletext/react";
import {
  getBreakpoint,
  getMediaQuery,
  isValidIconName,
  OakBox,
  OakCheckBox,
  OakFlex,
  OakFocusIndicator,
  OakHeading,
  OakIcon,
  OakImage,
  OakLI,
  OakLink,
  OakOutlineAccordion,
  OakP,
  OakPrimaryButton,
  OakQuote,
  OakSpan,
  OakSubjectIconButton,
  parseColor,
} from "@oaknational/oak-components";
import Link from "next/link";
import { FormEvent, useId, useState } from "react";
import styled from "styled-components";

import type { NationalCurriculumInsightsRouteData } from "./getNationalCurriculumInsightsData";
import { NationalCurriculumInsightsSelect } from "./NationalCurriculumInsightsSelect";
import {
  nationalCurriculumInsightsKeyStageIllustration,
  nationalCurriculumInsightsPhaseIllustration,
  nationalCurriculumInsightsPresentation,
} from "./nationalCurriculumInsightsPresentation";

import { nationalCurriculumInsightsKeyStageSlug } from "@/common-lib/cms-types/nationalCurriculumInsights";
import {
  nationalCurriculumInsightsSubjectHref,
  nationalCurriculumInsightsSubjectPhaseHref,
  nationalCurriculumInsightsSubjectPhaseKeyStageHref,
} from "@/common-lib/urls/nationalCurriculumInsights";
import { EDU_ROLES } from "@/browser-lib/hubspot/forms/getHubspotFormPayloads";
import { useNewsletterForm } from "@/components/GenericPagesComponents/NewsletterForm";
import { getSchema as getCampaignNewsletterSchema } from "@/components/GenericPagesComponents/CampaignNewsletterSignup/CampaignNewsletterSignup";
import getProxiedSanityAssetUrl from "@/common-lib/urls/getProxiedSanityAssetUrl";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";
import { OakInputWithLabel } from "@/components/SharedComponents/OakInputWithLabel/OakInputWithLabel";
import CMSVideo from "@/components/SharedComponents/CMSVideo";
import ResourcePageSchoolPicker from "@/components/TeacherComponents/ResourcePageSchoolPicker";
import useSchoolPicker from "@/components/TeacherComponents/ResourcePageSchoolPicker/useSchoolPicker";

type Page = NonNullable<NationalCurriculumInsightsRouteData["page"]>;
type InsightSection = Page["modules"][number];
type Subject = NationalCurriculumInsightsRouteData["hub"]["subjects"][number];
type Phase = "primary" | "secondary";
type OverviewPageKind = "hub" | "subject" | "phase" | "keyStage";

type SectionProps<T extends InsightSection["__typename"]> = {
  section: Extract<InsightSection, { __typename: T }>;
};

type ContextualSectionProps<T extends InsightSection["__typename"]> =
  SectionProps<T> & {
    data: NationalCurriculumInsightsRouteData;
  };

const DEFAULT_IMAGE = "/images/national-curriculum-insights/hero.jpg";
const GUIDANCE_TESTIMONIAL_IMAGE_URL = getProxiedSanityAssetUrl(
  "https://cdn.sanity.io/images/cuvjke51/feat-national-curriculum-insights/0cbe985b5819001d8cbc0c6e72bbb0f90259f167-54x54.png",
);

const insightsTabletMediaQuery = `(min-width: ${getBreakpoint(
  "small",
)}px) and (max-width: ${getBreakpoint("large")}px)`;

const insightsWideDesktopMediaQuery = `(min-width: ${
  getBreakpoint("large") + 1
}px)`;

const imageUrl = (
  image: { asset?: { url?: string | null } | null } | null | undefined,
  fallback = DEFAULT_IMAGE,
) => (image?.asset?.url ? getProxiedSanityAssetUrl(image.asset.url) : fallback);

const imageAlt = (
  image:
    | { altText?: string | null; isPresentational?: boolean | null }
    | null
    | undefined,
) => (image?.isPresentational ? "" : (image?.altText ?? ""));

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <OakP $font="body-2" $mv="spacing-0">
        {children}
      </OakP>
    ),
  },
};

const guidancePortableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <OakP $font="body-1" $mv="spacing-0">
        {children}
      </OakP>
    ),
  },
  listItem: {
    bullet: ({ children }) => <OakLI $font="body-1">{children}</OakLI>,
  },
};

const SectionMaxWidth = styled(OakBox)`
  width: 100%;
  max-width: 1221px;
`;

const OverviewPanel = styled(SectionMaxWidth)<{ $isKeyStage: boolean }>`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (${getMediaQuery("desktop")}) {
    height: auto;
    flex-direction: row;
    align-items: flex-start;
    gap: ${({ $isKeyStage }) => ($isKeyStage ? "81px" : "40px")};
  }

  @media ${insightsTabletMediaQuery} {
    height: auto;
    flex-direction: column;
    align-items: stretch;
    gap: 40px;
  }
`;

const OverviewCopy = styled(OakFlex)`
  width: 100%;

  @media (${getMediaQuery("desktop")}) {
    width: 684px;
    flex: 0 0 684px;
  }

  @media ${insightsTabletMediaQuery} {
    display: contents;
  }
`;

const OverviewTitleGroup = styled(OakFlex)`
  width: 100%;

  @media ${insightsTabletMediaQuery} {
    gap: 20px;
  }
`;

const OverviewBody = styled(OakBox)`
  @media ${insightsTabletMediaQuery} {
    order: 3;
  }
`;

const OverviewImage = styled(OakBox)<{
  $isKeyStage: boolean;
  $pageKind: OverviewPageKind;
}>`
  width: 100%;
  aspect-ratio: 332 / 259;
  overflow: hidden;

  @media (${getMediaQuery("desktop")}) {
    width: ${({ $isKeyStage }) => ($isKeyStage ? "295px" : "332px")};
    height: ${({ $isKeyStage }) => ($isKeyStage ? "312px" : "259px")};
    flex: ${({ $isKeyStage }) => ($isKeyStage ? "0 0 295px" : "0 0 332px")};
    align-self: center;
  }

  @media ${insightsTabletMediaQuery} {
    width: ${({ $pageKind }) => {
      switch ($pageKind) {
        case "subject":
          return "403px";
        case "phase":
          return "clamp(382px, calc(19.434vw + 236.245px), 485px)";
        case "keyStage":
          return "295px";
        case "hub":
          return "403px";
      }
    }};
    max-width: 100%;
    height: auto;
    aspect-ratio: ${({ $pageKind }) => {
      switch ($pageKind) {
        case "subject":
        case "hub":
          return "403 / 274";
        case "phase":
          return "485 / 318";
        case "keyStage":
          return "295 / 312";
      }
    }};
    flex: 0 1 auto;
    align-self: center;
    order: 2;
  }
`;

const overviewPageKind = (
  data: NationalCurriculumInsightsRouteData,
): OverviewPageKind => {
  switch (data.route.kind) {
    case "hub":
    case "guidance":
      return "hub";
    case "subject":
      return "subject";
    case "subjectPhase":
      return "phase";
    case "subjectPhaseKeyStage":
      return "keyStage";
  }
};

export const NationalCurriculumInsightsOverview = ({
  section,
  data,
}: ContextualSectionProps<"NationalCurriculumInsightsOverviewSection">) => {
  const headingId = useId();
  const isKeyStage = data.route.kind === "subjectPhaseKeyStage";
  const pageKind = overviewPageKind(data);
  const subjectIllustration =
    data.route.kind === "subject" ? data.subject?.illustration : null;
  const subjectIllustrationUrl = subjectIllustration?.asset?.url
    ? getProxiedSanityAssetUrl(subjectIllustration.asset.url)
    : null;
  const presentation = nationalCurriculumInsightsPresentation(
    data.route,
    subjectIllustrationUrl,
  );
  const illustrationIsPresentational =
    data.route.kind !== "subject" ||
    !subjectIllustration?.asset?.url ||
    subjectIllustration.isPresentational === true;

  return (
    <OakBox
      $ph={["spacing-20", "spacing-40"]}
      $pv={["spacing-32", "spacing-48"]}
    >
      <OverviewPanel
        $isKeyStage={isKeyStage}
        as="section"
        $mh="auto"
        $background={presentation.overviewBackground}
        $pa={["spacing-24", "spacing-40"]}
        $borderRadius="border-radius-l"
        aria-labelledby={headingId}
        data-insights-module="overview"
      >
        <OverviewCopy
          $flexDirection="column"
          $gap={isKeyStage ? "spacing-40" : "spacing-20"}
        >
          <OverviewTitleGroup
            $flexDirection="column"
            $gap={isKeyStage ? "spacing-40" : "spacing-20"}
          >
            <OakP $font="body-2" $mv="spacing-0">
              At a glance
            </OakP>
            <OakHeading
              id={headingId}
              tag="h2"
              $font={["heading-4", "heading-4", "heading-3"]}
            >
              {section.heading}
            </OakHeading>
          </OverviewTitleGroup>
          <OverviewBody>
            <PortableTextWithDefaults
              value={section.bodyPortableText}
              components={portableTextComponents}
            />
          </OverviewBody>
        </OverviewCopy>
        <OverviewImage
          $isKeyStage={isKeyStage}
          $pageKind={pageKind}
          aria-hidden={illustrationIsPresentational ? true : undefined}
        >
          <OakImage
            src={
              presentation.illustration ??
              "/images/national-curriculum-insights/overview.png"
            }
            alt={
              illustrationIsPresentational
                ? ""
                : (subjectIllustration?.altText ?? "")
            }
            $width="100%"
            $height="100%"
            $objectFit="contain"
          />
        </OverviewImage>
      </OverviewPanel>
    </OakBox>
  );
};

const PhaseCardList = styled.ul`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  justify-content: center;
  gap: 17px;
  list-style: none;
  margin: 0;
  padding: 0;

  @media (${getMediaQuery("desktop")}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const PhaseCardItem = styled.li`
  width: 100%;
`;

const InsightsJumpCard = styled(Link)<{ $height: number }>`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  height: ${({ $height }) => $height}px;
  padding: 16px;
  border: 1px solid ${parseColor("grey30")};
  border-radius: 8px;
  background: ${parseColor("bg-primary")};
  color: ${parseColor("text-primary")};
  text-decoration: none;

  &:hover {
    /* No Oak theme token currently matches the design's #F7F7F7. */
    background: #f7f7f7;
  }
`;

const JumpCardImage = styled(OakBox)`
  width: 72px;
  height: 72px;
  flex: 0 0 72px;
  overflow: hidden;
`;

const JumpCardCopy = styled(OakFlex)`
  flex: 1;
  align-self: stretch;
  justify-content: center;
`;

export const NationalCurriculumInsightsPhaseCards = ({
  section,
  data,
}: ContextualSectionProps<"NationalCurriculumInsightsPhaseCardsSection">) => {
  const subjectSlug = data.subject?.slug;
  if (!subjectSlug) {
    return null;
  }

  return (
    <OakBox
      $ph={["spacing-20", "spacing-40"]}
      $pv={["spacing-32", "spacing-48"]}
    >
      <SectionMaxWidth $mh="auto">
        <PhaseCardList data-insights-module="phase-cards">
          {section.cards.map((card) => (
            <PhaseCardItem key={`${card.phase}-${card.heading}`}>
              <InsightsJumpCard
                $height={240}
                href={nationalCurriculumInsightsSubjectPhaseHref(
                  subjectSlug,
                  card.phase,
                )}
              >
                <JumpCardImage aria-hidden="true">
                  <OakImage
                    src={nationalCurriculumInsightsPhaseIllustration(
                      card.phase,
                    )}
                    alt=""
                    $width="100%"
                    $height="100%"
                    $objectFit="contain"
                  />
                </JumpCardImage>
                <JumpCardCopy
                  $flexDirection="column"
                  $justifyContent="center"
                  $gap="spacing-4"
                >
                  <OakHeading tag="h2" $font="heading-6">
                    {card.heading}
                  </OakHeading>
                  <OakP $font="body-2" $color="text-subdued" $mv="spacing-0">
                    {card.linkLabel}
                  </OakP>
                </JumpCardCopy>
                <OakIcon
                  iconName="arrow-right"
                  $width="spacing-32"
                  $height="spacing-32"
                />
              </InsightsJumpCard>
            </PhaseCardItem>
          ))}
        </PhaseCardList>
      </SectionMaxWidth>
    </OakBox>
  );
};

export const NationalCurriculumInsightsKeyStageCards = ({
  section,
  data,
}: ContextualSectionProps<"NationalCurriculumInsightsKeyStageCardsSection">) => {
  if (!data.subject || !data.activeTab || data.activeTab === "overview") {
    return null;
  }

  const phase = data.activeTab;
  const phasePage = data.subject.tabs.find(({ kind }) => kind === phase)?.page;
  const availableKeyStages = new Set(
    phasePage?.keyStages.map(({ keyStage }) => keyStage) ?? [],
  );
  const cards = section.cards.filter(({ keyStage }) =>
    availableKeyStages.has(keyStage),
  );

  if (cards.length === 0) {
    return null;
  }

  return (
    <OakBox
      $ph={["spacing-20", "spacing-40"]}
      $pv={["spacing-32", "spacing-48"]}
    >
      <SectionMaxWidth $mh="auto">
        <PhaseCardList data-insights-module="key-stage-cards">
          {cards.map((card) => (
            <PhaseCardItem key={`${card.keyStage}-${card.heading}`}>
              <InsightsJumpCard
                $height={246}
                href={nationalCurriculumInsightsSubjectPhaseKeyStageHref(
                  data.subject!.slug,
                  phase,
                  nationalCurriculumInsightsKeyStageSlug(card.keyStage),
                )}
              >
                <JumpCardImage aria-hidden="true">
                  <OakImage
                    src={nationalCurriculumInsightsKeyStageIllustration(
                      card.keyStage,
                    )}
                    alt=""
                    $width="100%"
                    $height="100%"
                    $objectFit="contain"
                  />
                </JumpCardImage>
                <JumpCardCopy
                  $flexDirection="column"
                  $justifyContent="center"
                  $gap="spacing-4"
                >
                  <OakHeading tag="h2" $font="heading-6">
                    {card.heading}
                  </OakHeading>
                  <OakP $font="body-2" $color="text-subdued" $mv="spacing-0">
                    {card.linkLabel}
                  </OakP>
                </JumpCardCopy>
                <OakIcon
                  iconName="arrow-right"
                  $width="spacing-32"
                  $height="spacing-32"
                />
              </InsightsJumpCard>
            </PhaseCardItem>
          ))}
        </PhaseCardList>
      </SectionMaxWidth>
    </OakBox>
  );
};

const PromotionalHeadingFrame = styled(OakFlex)`
  box-sizing: border-box;
  width: 100%;
  max-width: 1106px;
  justify-content: center;
  text-align: center;
`;

export const NationalCurriculumInsightsPromotionalHeading = ({
  section,
}: SectionProps<"NationalCurriculumInsightsPromotionalHeadingSection">) => {
  return (
    <OakBox
      $ph={["spacing-20", "spacing-40"]}
      $pv={["spacing-32", "spacing-48"]}
    >
      <PromotionalHeadingFrame
        $mh="auto"
        $alignItems="center"
        data-insights-module="promotional-heading"
      >
        <OakHeading tag="h2" $font={["heading-5", "heading-4"]}>
          {section.heading}
        </OakHeading>
      </PromotionalHeadingFrame>
    </OakBox>
  );
};

const SubjectList = styled(OakFlex)`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const SubjectNavigationMaxWidth = styled(OakBox)`
  width: 100%;
  max-width: 998px;

  @media (${getMediaQuery("desktop")}) {
    min-height: 176px;
    display: flex;
    align-items: center;
  }

  a {
    background: ${parseColor("bg-primary")};
    border-color: ${parseColor("grey30")};
  }
`;

const HubSubjectItem = styled.li`
  width: 225px;
  height: 225px;

  @media (${getMediaQuery("mobile")}) {
    width: calc(50% - 8px);
    height: auto;
    aspect-ratio: 1;
  }

  > * {
    width: 100%;
    height: 100%;
  }

  a {
    box-sizing: border-box;
    width: 100%;
    padding-inline: 8px;
  }
`;

const HubSubjectList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const HubPhaseNavigation = styled.nav`
  width: 100%;

  @media (${getMediaQuery("desktop")}) {
    max-width: 1189px;
    margin-inline: auto;
  }
`;

const normaliseSubjectIcon = (subject: Subject) => {
  const preferred = `subject-${subject.slug}`;
  if (isValidIconName(preferred)) {
    return preferred;
  }

  const mapped = `subject-${subject.curriculumSubjectSlugs[0]}`;
  return isValidIconName(mapped) ? mapped : "question-mark";
};

export const NationalCurriculumInsightsSubjectNavigation = ({
  section,
  data,
}: ContextualSectionProps<"NationalCurriculumInsightsSubjectNavigationSection">) => {
  if (data.route.kind !== "hub") {
    const phase =
      data.activeTab && data.activeTab !== "overview"
        ? data.activeTab
        : undefined;
    const subjects = data.hub.subjects.filter(
      (subject) => !phase || subject.tabs.some(({ kind }) => kind === phase),
    );

    return (
      <OakBox
        as="nav"
        aria-label="Explore curriculum changes by subject"
        $ph={["spacing-20", "spacing-40"]}
        $pb={["spacing-48", "spacing-64"]}
      >
        <SubjectNavigationMaxWidth
          $mh="auto"
          data-insights-module="subject-navigation"
        >
          <SubjectList
            as="ul"
            $flexWrap="wrap"
            $justifyContent="center"
            $gap="spacing-12"
          >
            {subjects.map((subject) => (
              <li key={subject.slug}>
                <OakSubjectIconButton
                  variant="horizontal"
                  element={Link}
                  phase={(phase ?? "non-curriculum") as Phase}
                  subjectIconName={normaliseSubjectIcon(subject)}
                  href={
                    phase
                      ? nationalCurriculumInsightsSubjectPhaseHref(
                          subject.slug,
                          phase,
                        )
                      : nationalCurriculumInsightsSubjectHref(subject.slug)
                  }
                >
                  {subject.title}
                </OakSubjectIconButton>
              </li>
            ))}
          </SubjectList>
        </SubjectNavigationMaxWidth>
      </OakBox>
    );
  }

  return (
    <OakBox
      $ph={["spacing-20", "spacing-40"]}
      $pb={["spacing-48", "spacing-64"]}
    >
      <SectionMaxWidth $mh="auto" data-insights-module="subject-catalogue">
        <OakFlex $flexDirection="column" $gap="spacing-40">
          {section.phases.map((phase) => (
            <HubPhaseNavigation
              key={phase}
              aria-labelledby={`national-curriculum-insights-${phase}-subjects`}
            >
              <OakFlex
                $flexDirection="column"
                $gap="spacing-16"
                $alignItems={["center", "center", "stretch"]}
              >
                <OakHeading
                  tag="h3"
                  id={`national-curriculum-insights-${phase}-subjects`}
                  $font="heading-5"
                  $textAlign={["center", "center", "left"]}
                >
                  {phase === "primary"
                    ? section.primaryHeading
                    : section.secondaryHeading}
                </OakHeading>
                <HubSubjectList>
                  {data.hub.subjects
                    .filter((subject) =>
                      subject.tabs.some(({ kind }) => kind === phase),
                    )
                    .map((subject) => (
                      <HubSubjectItem key={`${phase}-${subject.slug}`}>
                        <OakSubjectIconButton
                          variant="vertical"
                          innerWidth="100%"
                          element={Link}
                          phase={phase as Phase}
                          subjectIconName={normaliseSubjectIcon(subject)}
                          href={nationalCurriculumInsightsSubjectPhaseHref(
                            subject.slug,
                            phase,
                          )}
                        >
                          {subject.title}
                        </OakSubjectIconButton>
                      </HubSubjectItem>
                    ))}
                </HubSubjectList>
              </OakFlex>
            </HubPhaseNavigation>
          ))}
        </OakFlex>
      </SectionMaxWidth>
    </OakBox>
  );
};

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
`;

const GuidanceExplainerImage = styled(OakBox)`
  width: 269px;
  max-width: 100%;
  aspect-ratio: 332 / 259;
  justify-self: center;
  overflow: hidden;

  @media (min-width: 376px) and (max-width: ${getBreakpoint("small") - 1}px) {
    width: clamp(269px, calc(62.032vw + 35.76px), 501px);
  }

  @media (${getMediaQuery("desktop")}) {
    width: 332px;
    height: 259px;
    grid-column: 2;
    grid-row: 1 / span 2;
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
        $pv={["spacing-48", "spacing-64"]}
        aria-labelledby={headingId}
        data-insights-module="guidance-benefits"
      >
        <GuidanceExplainerLayout $mh="auto">
          <GuidanceExplainerHeading tag="h2" id={headingId} $font="heading-5">
            {section.heading}
          </GuidanceExplainerHeading>
          <GuidanceExplainerImage
            aria-hidden={section.image.isPresentational || undefined}
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

const GuidanceIntroImage = styled(OakBox)`
  width: 100%;
  aspect-ratio: 3 / 2;
  overflow: hidden;
  border: 2px solid ${parseColor("border-primary")};

  @media (${getMediaQuery("desktop")}) {
    width: 363px;
    height: 242px;
    flex: 0 0 363px;
  }

  @media ${insightsTabletMediaQuery} {
    width: clamp(291px, calc(13.585vw + 189.113px), 363px);
    height: auto;
    flex: 0 0 auto;
  }
`;

const GuidanceIntroLayout = styled(OakBox)`
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  row-gap: 20px;

  @media (${getMediaQuery("desktop")}) {
    grid-template-columns: 363px 684px;
    grid-template-rows: auto 1fr;
    column-gap: 40px;
    row-gap: 40px;
    align-items: start;
  }

  @media ${insightsTabletMediaQuery} {
    width: clamp(675px, calc(51.887vw + 285.849px), 950px);
    max-width: 100%;
    grid-template-columns:
      clamp(291px, calc(13.585vw + 189.113px), 363px)
      minmax(0, 1fr);
    grid-template-rows: auto 1fr;
    column-gap: 40px;
    row-gap: clamp(20px, calc(3.774vw - 8.302px), 40px);
    align-items: start;
    margin-inline: auto;
  }
`;

const GuidanceIntroHeading = styled(OakHeading)`
  grid-column: 1;
  grid-row: 1;

  @media (${getMediaQuery("desktop")}) {
    grid-column: 2;
  }

  @media ${insightsTabletMediaQuery} {
    grid-column: 2;
    grid-row: 1;
  }
`;

const GuidanceIntroDesktopHeading = styled.span`
  display: none;

  @media ${insightsWideDesktopMediaQuery} {
    display: inline;
  }
`;

const GuidanceIntroMobileHeading = styled.span`
  @media ${insightsWideDesktopMediaQuery} {
    display: none;
  }
`;

const GuidanceIntroBody = styled(OakFlex)`
  grid-column: 1;
  grid-row: 3;

  @media (${getMediaQuery("desktop")}) {
    grid-column: 2;
    grid-row: 2;
  }

  @media ${insightsTabletMediaQuery} {
    grid-column: 2;
    grid-row: 2;
  }
`;

const GuidanceIntroArtwork = styled(GuidanceIntroImage)`
  grid-column: 1;
  grid-row: 2;

  @media (${getMediaQuery("desktop")}) {
    grid-row: 1 / span 2;
  }

  @media ${insightsTabletMediaQuery} {
    grid-column: 1;
    grid-row: 1 / span 2;
  }
`;

const GuidanceTaggedParagraph = styled(OakBox)`
  > div:first-child {
    float: left;
    margin: 0 8px 0 0;
  }

  &::after {
    display: table;
    clear: both;
    content: "";
  }
`;

const GuidanceStatusTag = styled(OakBox)`
  width: fit-content;
  white-space: nowrap;

  > div {
    width: max-content;
    min-width: 141px;
    justify-content: center;
    white-space: nowrap;
  }
`;

const GuidanceClockIcon = () => (
  <svg
    aria-hidden="true"
    data-testid="guidance-status-clock"
    focusable="false"
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="none"
  >
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="2" />
    <path
      d="M12 7.5V12l3 2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const GuidanceStatusLabel = ({ label }: { label: string }) => (
  <OakFlex
    $alignItems="center"
    $justifyContent="center"
    $gap="spacing-4"
    $background="bg-decorative5-main"
    $color="text-primary"
    $borderRadius="border-radius-s"
    $ph="spacing-8"
    $pv="spacing-4"
  >
    <GuidanceClockIcon />
    <OakSpan $font="heading-7">{label}</OakSpan>
  </OakFlex>
);

export const NationalCurriculumInsightsGuidanceIntro = ({
  section,
}: SectionProps<"NationalCurriculumInsightsGuidanceIntroSection">) => {
  const headingId = useId();
  const [leadBlock, ...remainingBlocks] = section.bodyPortableText;
  const hasTaggedSecondParagraph = Boolean(
    section.statusLabel && leadBlock && remainingBlocks.length > 0,
  );

  return (
    <OakBox
      as="section"
      $background="bg-primary"
      $ph={["spacing-24", "spacing-40"]}
      $pv={["spacing-32", "spacing-32", "spacing-40"]}
      aria-labelledby={headingId}
      data-insights-module="guidance-introduction"
    >
      <SectionMaxWidth $mh="auto">
        <GuidanceIntroLayout>
          <GuidanceIntroHeading id={headingId} tag="h2" $font="heading-5">
            <GuidanceIntroMobileHeading>
              This term, you’ll find:
            </GuidanceIntroMobileHeading>
            <GuidanceIntroDesktopHeading>
              {section.heading}
            </GuidanceIntroDesktopHeading>
          </GuidanceIntroHeading>
          <GuidanceIntroArtwork
            aria-hidden={section.image.isPresentational || undefined}
          >
            <OakImage
              src={imageUrl(section.image)}
              alt={imageAlt(section.image)}
              $width="100%"
              $height="100%"
              $objectFit="cover"
            />
          </GuidanceIntroArtwork>
          <GuidanceIntroBody $flexDirection="column" $gap="spacing-24">
            {hasTaggedSecondParagraph ? (
              <>
                <PortableTextWithDefaults
                  value={[leadBlock]}
                  components={guidancePortableTextComponents}
                />
                <GuidanceTaggedParagraph>
                  <GuidanceStatusTag>
                    <GuidanceStatusLabel label={section.statusLabel!} />
                  </GuidanceStatusTag>
                  <PortableTextWithDefaults
                    value={remainingBlocks}
                    components={guidancePortableTextComponents}
                  />
                </GuidanceTaggedParagraph>
              </>
            ) : (
              <>
                <PortableTextWithDefaults
                  value={section.bodyPortableText}
                  components={guidancePortableTextComponents}
                />
                {section.statusLabel ? (
                  <GuidanceStatusTag $alignSelf="flex-start">
                    <GuidanceStatusLabel label={section.statusLabel} />
                  </GuidanceStatusTag>
                ) : null}
              </>
            )}
          </GuidanceIntroBody>
        </GuidanceIntroLayout>
      </SectionMaxWidth>
    </OakBox>
  );
};

const VideoCardList = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 64px;
  list-style: none;
  margin: 0;
  padding: 0;

  @media (${getMediaQuery("desktop")}) {
    gap: 40px;
  }
`;

const VideoCardItem = styled.li`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const VideoCardsSection = styled(OakBox)`
  box-sizing: border-box;
`;

const ConversationInner = styled(OakFlex)`
  width: 100%;
  max-width: 985px;
`;

const ConversationHeader = styled(OakFlex)`
  width: 100%;

  @media (${getMediaQuery("desktop")}) {
    min-height: 212px;
  }
`;

const ConversationHeaderArtwork = styled(OakBox)`
  display: none;

  @media (${getMediaQuery("desktop")}) {
    display: block;
    width: 250px;
    height: 212px;
    flex: 0 0 250px;
  }

  @media ${insightsTabletMediaQuery} {
    display: none;
  }
`;

const ConversationHeaderCopy = styled(OakFlex)`
  width: 100%;

  @media (${getMediaQuery("desktop")}) {
    width: 690px;
    flex: 0 0 690px;
  }

  @media ${insightsTabletMediaQuery} {
    width: 100%;
    flex: 0 1 auto;
  }
`;

const ConversationCardFocus = styled(OakFocusIndicator)<{
  $featured: boolean;
}>`
  position: relative;
  width: 100%;
  max-width: 342px;
  border-radius: 6.645px;

  @media ${insightsTabletMediaQuery} {
    max-width: 100%;
  }

  @media (${getMediaQuery("desktop")}) {
    max-width: ${({ $featured }) => ($featured ? "976px" : "985px")};
    min-height: ${({ $featured }) => ($featured ? "301.582px" : "188.582px")};
  }
`;

const ConversationCardLink = styled(OakFlex)<{ $featured: boolean }>`
  box-sizing: border-box;
  width: 100%;
  min-height: 100%;
  padding: 13.291px;
  gap: 13.291px;
  border-radius: 6.645px;
  color: ${parseColor("text-primary")};
  text-decoration: none;
  border: 0;
  background: transparent;
  font: inherit;
  text-align: left;
  cursor: pointer;

  &:hover h3,
  &:hover span {
    text-decoration: underline;
  }

  @media (${getMediaQuery("desktop")}) {
    flex-direction: row;
  }
`;

const ConversationCardImage = styled(OakBox)<{ $featured: boolean }>`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  flex: 0 0 auto;
  overflow: hidden;

  @media (${getMediaQuery("desktop")}) {
    width: ${({ $featured }) => ($featured ? "491px" : "290px")};
    height: ${({ $featured }) => ($featured ? "275px" : "163px")};
  }
`;

const ThumbnailPlayButton = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 3;
  display: inline-flex;
  width: 64px;
  height: 64px;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 2px solid ${parseColor("border-primary")};
  border-radius: 50%;
  background: ${parseColor("bg-btn-primary")};
  color: ${parseColor("icon-inverted")};
  cursor: pointer;
  transform: translate(-50%, -50%);

  &:hover {
    background: ${parseColor("bg-btn-primary-hover")};
  }

  &:focus-visible {
    outline: 4px solid ${parseColor("border-decorative5")};
    outline-offset: 2px;
  }
`;

const InlineVideo = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;

  > div {
    height: 100%;
  }
`;

const ConversationCardCopy = styled(OakFlex)`
  width: 100%;
  min-width: 0;
`;

const BlogPostTitleLink = styled(Link)`
  color: inherit;
  text-decoration: none;

  &::after {
    position: absolute;
    z-index: 1;
    inset: 0;
    border-radius: 6.645px;
    content: "";
  }

  &:hover,
  &:focus-visible {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: none;
  }

  &:focus-visible::after {
    outline: 4px solid ${parseColor("border-decorative5")};
    outline-offset: 2px;
  }
`;

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

const GuidanceConversationCard = ({
  card,
  episode,
  featured,
}: {
  card: NonNullable<
    Extract<
      InsightSection,
      { __typename: "NationalCurriculumInsightsVideoCardsSection" }
    >["cards"]
  >[number];
  episode: number;
  featured: boolean;
}) => (
  <ConversationCardFocus
    $featured={featured}
    $background="bg-primary"
    hoverBackground="bg-btn-secondary-hover"
    $borderRadius="border-radius-m2"
  >
    <ConversationCardLink
      as="a"
      href={card.videoUrl}
      $featured={featured}
      $flexDirection="column"
    >
      <ConversationCardImage
        $featured={featured}
        $borderRadius="border-radius-m2"
      >
        <OakImage
          src={imageUrl(card.image)}
          alt={imageAlt(card.image)}
          $width="100%"
          $height="100%"
          $objectFit="cover"
        />
      </ConversationCardImage>
      <ConversationCardCopy
        $flexDirection="column"
        $justifyContent="space-between"
        $gap="spacing-20"
      >
        <OakFlex $flexDirection="column" $gap="spacing-12">
          <OakHeading tag="h3" $font="heading-7">
            {card.heading}
          </OakHeading>
          <OakP $font="body-3" $color="text-subdued" $mv="spacing-0">
            {card.description}
          </OakP>
        </OakFlex>
        <OakFlex
          $alignItems="center"
          $justifyContent="flex-end"
          $gap="spacing-4"
        >
          <OakSpan $font="body-3">Watch episode {episode}</OakSpan>
          <OakIcon
            iconName="arrow-right"
            alt=""
            $width="spacing-20"
            $height="spacing-20"
          />
        </OakFlex>
      </ConversationCardCopy>
    </ConversationCardLink>
  </ConversationCardFocus>
);

const GuidanceBlogPostCard = ({
  post,
  episode,
  featured,
}: {
  post: NonNullable<
    Extract<
      InsightSection,
      { __typename: "NationalCurriculumInsightsVideoCardsSection" }
    >["posts"]
  >[number];
  episode: number;
  featured: boolean;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const cardContent = (
    <>
      <ConversationCardImage
        $featured={featured}
        $borderRadius="border-radius-m2"
      >
        {post.video && isPlaying ? (
          <InlineVideo data-testid="guidance-inline-video">
            <CMSVideo
              video={post.video}
              location="blog"
              hideCaptions
              omitBorder
              autoPlay
              autoFocusPlayButton
            />
          </InlineVideo>
        ) : (
          <>
            <OakImage
              src={imageUrl(post.image)}
              alt={imageAlt(post.image)}
              $width="100%"
              $height="100%"
              $objectFit="cover"
            />
            {post.video ? (
              <ThumbnailPlayButton
                type="button"
                aria-label={`Play ${post.title}`}
                onClick={() => setIsPlaying(true)}
              >
                <OakIcon
                  iconName="play"
                  alt=""
                  $color="icon-inverted"
                  $width="spacing-32"
                  $height="spacing-32"
                />
              </ThumbnailPlayButton>
            ) : null}
          </>
        )}
      </ConversationCardImage>
      <ConversationCardCopy
        $flexDirection="column"
        $justifyContent="space-between"
        $gap="spacing-20"
      >
        <OakFlex $flexDirection="column" $gap="spacing-12">
          <OakHeading tag="h3" $font="heading-7">
            <BlogPostTitleLink href={`/blog/${post.slug}`}>
              {post.title}
            </BlogPostTitleLink>
          </OakHeading>
          <OakP $font="body-3" $color="text-subdued" $mv="spacing-0">
            {post.summary}
          </OakP>
        </OakFlex>
        <OakFlex
          $alignItems="center"
          $justifyContent="flex-end"
          $gap="spacing-4"
        >
          <OakSpan $font="body-3">Watch episode {episode}</OakSpan>
          <OakIcon
            iconName="arrow-right"
            alt=""
            $width="spacing-20"
            $height="spacing-20"
          />
        </OakFlex>
      </ConversationCardCopy>
    </>
  );

  return (
    <ConversationCardFocus
      $featured={featured}
      $background="bg-primary"
      hoverBackground="bg-btn-secondary-hover"
      $borderRadius="border-radius-m2"
    >
      <ConversationCardLink
        as="div"
        $featured={featured}
        $flexDirection="column"
      >
        {cardContent}
      </ConversationCardLink>
    </ConversationCardFocus>
  );
};

export const NationalCurriculumInsightsVideoCards = ({
  section,
}: SectionProps<"NationalCurriculumInsightsVideoCardsSection">) => {
  const headingId = useId();
  const posts = section.posts ?? [];
  const legacyCards = posts.length > 0 ? [] : (section.cards ?? []);
  const itemCount = posts.length || legacyCards.length;

  return (
    <VideoCardsSection
      as="section"
      $background="bg-decorative5-very-subdued"
      $ph={["spacing-16", "spacing-40"]}
      $pv="spacing-80"
      $borderRadius="border-radius-l"
      aria-labelledby={headingId}
      data-insights-module="guidance-conversations"
    >
      <ConversationInner $mh="auto" $flexDirection="column" $gap="spacing-64">
        <ConversationHeader
          $flexDirection={["column", "column", "row"]}
          $alignItems="center"
          $gap="spacing-40"
        >
          <ConversationHeaderArtwork aria-hidden>
            <OakImage
              src="https://cdn.sanity.io/images/cuvjke51/production/24687686f2d49e24e16432073efee65db0eda2cd-1296x1098.svg"
              alt=""
              $width="100%"
              $height="100%"
              $objectFit="contain"
            />
          </ConversationHeaderArtwork>
          <ConversationHeaderCopy $flexDirection="column" $gap="spacing-20">
            <OakHeading tag="h2" id={headingId} $font="heading-3">
              {section.heading}
            </OakHeading>
            {section.introductionPortableText ? (
              <PortableTextWithDefaults
                value={section.introductionPortableText}
                components={portableTextComponents}
              />
            ) : null}
          </ConversationHeaderCopy>
        </ConversationHeader>
        <VideoCardList>
          {posts.map((post, index) => (
            <VideoCardItem key={post.id}>
              <GuidanceBlogPostCard
                post={post}
                episode={itemCount - index}
                featured={index === 0}
              />
            </VideoCardItem>
          ))}
          {legacyCards.map((card, index) => (
            <VideoCardItem key={`${card.heading}-${card.videoUrl}`}>
              <GuidanceConversationCard
                card={card}
                episode={itemCount - index}
                featured={index === 0}
              />
            </VideoCardItem>
          ))}
        </VideoCardList>
      </ConversationInner>
    </VideoCardsSection>
  );
};

export const NationalCurriculumInsightsQuote = ({
  section,
}: SectionProps<"NationalCurriculumInsightsQuoteSection">) => {
  const isBeckyFrancisTestimonial = section.attribution
    .toLocaleLowerCase("en-GB")
    .includes("becky francis");
  const authorImageSrc = isBeckyFrancisTestimonial
    ? GUIDANCE_TESTIMONIAL_IMAGE_URL
    : section.image?.asset?.url
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

export const NationalCurriculumInsightsRichText = ({
  section,
}: SectionProps<"NationalCurriculumInsightsRichTextSection">) => {
  const headingId = useId();

  return (
    <OakBox
      as="section"
      $ph={["spacing-20", "spacing-40"]}
      $pv="spacing-16"
      aria-labelledby={headingId}
    >
      <InsightsContentMaxWidth
        $mh="auto"
        $flexDirection="column"
        data-insights-module="rich-text"
      >
        <RichTextContent
          $flexDirection="column"
          $gap={section.headingStyle === "detail" ? "spacing-32" : "spacing-24"}
        >
          <OakHeading
            tag="h2"
            id={headingId}
            $font={
              section.headingStyle === "detail"
                ? "heading-7"
                : ["heading-5", "heading-4"]
            }
          >
            {section.heading}
          </OakHeading>
          <PortableTextWithDefaults value={section.contentPortableText} />
        </RichTextContent>
      </InsightsContentMaxWidth>
    </OakBox>
  );
};

const InsightsContentMaxWidth = styled(OakFlex)`
  width: 100%;
  max-width: 956px;
`;

const RichTextContent = styled(OakFlex)`
  width: 100%;
  max-width: 830px;
`;

const TableScroll = styled(OakBox)`
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
`;

const InsightsTable = styled.table`
  width: 100%;
  min-width: 640px;
  border-spacing: 0;
  border-collapse: separate;
  border: 1px solid ${parseColor("border-decorative1-stronger")};
  border-radius: 8px;
  overflow: hidden;

  th,
  td {
    padding: 12px;
    border-right: 1px solid ${parseColor("border-decorative1-stronger")};
    border-bottom: 1px solid ${parseColor("border-decorative1-stronger")};
    text-align: left;
    vertical-align: top;
    font-size: 16px;
    line-height: 24px;
  }

  th {
    background: ${parseColor("bg-decorative1-main")};
    font-weight: 700;
    line-height: 20px;
  }

  tbody tr:nth-child(odd) td {
    background: ${parseColor("bg-primary")};
  }

  tbody tr:nth-child(even) td {
    background: ${parseColor("bg-decorative1-very-subdued")};
  }

  tr:last-child td {
    border-bottom: 0;
  }

  th:last-child,
  td:last-child {
    border-right: 0;
  }
`;

export const NationalCurriculumInsightsTable = ({
  section,
}: SectionProps<"NationalCurriculumInsightsTableSection">) => {
  return (
    <OakBox
      as="section"
      $ph={["spacing-20", "spacing-40"]}
      $pv="spacing-16"
      aria-label={section.heading}
    >
      <InsightsContentMaxWidth
        $mh="auto"
        $flexDirection="column"
        data-insights-module="table"
      >
        <TableScroll>
          <InsightsTable>
            <thead>
              <tr>
                {section.table.rows[0]?.cells.map((cell, cellIndex) => (
                  <th scope="col" key={`${section.heading}-head-${cellIndex}`}>
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.table.rows.slice(1).map((row, rowIndex) => (
                <tr key={`${section.heading}-${rowIndex}`}>
                  {row.cells.map((cell, cellIndex) => (
                    <td key={`${section.heading}-${rowIndex}-${cellIndex}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </InsightsTable>
        </TableScroll>
      </InsightsContentMaxWidth>
    </OakBox>
  );
};

const NewsletterList = styled(OakFlex)`
  list-style: disc;
  margin: 0;
  padding-left: 24px;
`;

const NewsletterSection = styled(OakBox)`
  box-sizing: border-box;

  @media (${getMediaQuery("desktop")}) {
    height: 632px;
    display: flex;
    align-items: center;
  }

  @media ${insightsTabletMediaQuery} {
    height: auto;
    display: block;
    padding-block: 40px;
  }
`;

const NewsletterInner = styled(OakBox)<{ $isGuidance: boolean }>`
  width: 100%;
  max-width: ${({ $isGuidance }) => ($isGuidance ? "1151px" : "1058px")};

  @media (${getMediaQuery("desktop")}) {
    transform: ${({ $isGuidance }) =>
      $isGuidance ? "none" : "translateX(12px)"};
  }
`;

const NewsletterLayout = styled(OakBox)`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 20px;

  @media (${getMediaQuery("desktop")}) {
    grid-template-columns: 544px 475px;
    grid-template-rows: auto 1fr;
    column-gap: 39px;
    row-gap: 16px;
    justify-content: center;
    align-items: start;
  }

  @media ${insightsTabletMediaQuery} {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto auto auto;
    row-gap: 16px;
    justify-content: stretch;
  }
`;

const NewsletterLead = styled(OakFlex)`
  width: 100%;
  grid-column: 1;
  grid-row: 1;

  @media (${getMediaQuery("desktop")}) {
    width: 544px;
  }

  @media ${insightsTabletMediaQuery} {
    width: clamp(666px, calc(38.679vw + 375.906px), 871px);
    max-width: 100%;
    justify-self: center;
  }
`;

const NewsletterDetails = styled(OakFlex)`
  width: 100%;
  grid-column: 1;
  grid-row: 3;

  @media (${getMediaQuery("desktop")}) {
    width: 544px;
    grid-row: 2;
  }

  @media ${insightsTabletMediaQuery} {
    width: clamp(666px, calc(28.113vw + 455.151px), 815px);
    max-width: 100%;
    grid-column: 1;
    grid-row: 2;
    justify-self: center;
  }
`;

const NewsletterSelectField = styled(OakBox)`
  button {
    min-height: 64px;
  }
`;

const NewsletterForm = styled(OakFlex)`
  width: 100%;
  grid-column: 1;
  grid-row: 2;

  input:not([type="checkbox"]),
  select {
    min-height: 64px;
  }

  input[type="checkbox"] {
    border-radius: 0;
  }

  button {
    height: 48px;
    min-height: 48px;
  }

  @media (${getMediaQuery("desktop")}) {
    width: 475px;
    grid-column: 2;
    grid-row: 1 / span 2;
  }

  @media ${insightsTabletMediaQuery} {
    width: min(100%, 686px);
    grid-column: 1;
    grid-row: 3;
    justify-self: center;
    margin-top: 32px;
  }
`;

export const NationalCurriculumInsightsNewsletter = ({
  section,
  data,
}: ContextualSectionProps<"NationalCurriculumInsightsNewsletterSection">) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [schoolNotListed, setSchoolNotListed] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { onSubmit: submitNewsletter } = useNewsletterForm();
  const isGuidance = data.route.kind === "guidance";
  const {
    schools,
    schoolPickerInputValue,
    setSchoolPickerInputValue,
    setSelectedSchool,
  } = useSchoolPicker({ withHomeschool: false });

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");
    setSuccessMessage("");

    const result = getCampaignNewsletterSchema({
      freeSchoolInput: true,
      enableRole: true,
    }).safeParse({
      name,
      email,
      schoolOrg: schoolPickerInputValue,
      schoolNotListed,
      eduRole: role,
    });

    if (!result.success) {
      setFieldErrors(
        Object.fromEntries(
          result.error.issues.map((issue) => [
            String(issue.path[0] ?? "form"),
            issue.message,
          ]),
        ),
      );
      return;
    }

    setFieldErrors({});
    setSubmitting(true);
    try {
      await submitNewsletter({
        name,
        email,
        userRole: "",
        eduRole: role,
        schoolName: schoolNotListed ? "notListed" : schoolPickerInputValue,
      });
      setSuccessMessage("Thanks, that's been received");
    } catch {
      setSubmitError("We couldn't submit the form. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <NewsletterSection
      as="section"
      $background={isGuidance ? "bg-primary" : "bg-decorative5-very-subdued"}
      $ph={["spacing-20", "spacing-40"]}
      $pv={["spacing-48", "spacing-48"]}
      $borderRadius="border-radius-l"
      aria-labelledby="national-curriculum-insights-newsletter-heading"
      data-insights-module="newsletter"
    >
      <NewsletterInner $mh="auto" $isGuidance={isGuidance}>
        <NewsletterLayout>
          <NewsletterLead $flexDirection="column" $gap="spacing-16">
            <OakFlex $alignItems="center" $gap="spacing-12">
              <OakImage
                src={imageUrl(
                  section.illustration,
                  "/images/national-curriculum-insights/newsletter.png",
                )}
                alt={imageAlt(section.illustration)}
                style={{ width: 60, height: 50 }}
                $objectFit="contain"
                aria-hidden={section.illustration.isPresentational || undefined}
              />
              <OakHeading
                tag="h2"
                id="national-curriculum-insights-newsletter-heading"
                $font="heading-4"
              >
                {section.heading}
              </OakHeading>
            </OakFlex>
            <OakP
              $font={isGuidance ? "body-1-bold" : "heading-7"}
              $mv="spacing-0"
            >
              {section.introduction}
            </OakP>
          </NewsletterLead>
          <NewsletterDetails $flexDirection="column" $gap="spacing-16">
            <OakP $font={isGuidance ? "body-1" : "body-2"} $mv="spacing-0">
              {section.benefitsHeading ?? "Sign up now for:"}
            </OakP>
            <NewsletterList as="ul" $flexDirection="column" $gap="spacing-16">
              {section.benefits.map((benefit) => (
                <li key={benefit}>
                  <OakP
                    $font={isGuidance ? "body-1" : "body-2"}
                    $mv="spacing-0"
                  >
                    {benefit}
                  </OakP>
                </li>
              ))}
            </NewsletterList>
            <PortableTextWithDefaults
              value={section.privacyPortableText}
              components={
                isGuidance ? guidancePortableTextComponents : undefined
              }
            />
          </NewsletterDetails>

          <NewsletterForm
            as="form"
            onSubmit={onSubmit}
            $gap="spacing-48"
            $flexDirection="column"
            data-form-id={section.formId ?? undefined}
          >
            <OakInputWithLabel
              label="Name"
              id="insights-newsletter-name"
              name="name"
              required
              defaultValue={name}
              error={fieldErrors.name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Type your name"
              autocomplete="name"
            />
            <NewsletterSelectField $position="relative">
              <NationalCurriculumInsightsSelect
                id="insights-newsletter-role"
                name="role"
                label="Role"
                placeholder="Select your role"
                options={EDU_ROLES.map((option) => ({
                  label: option,
                  value: option,
                }))}
                value={role}
                onChange={setRole}
                error={fieldErrors.eduRole}
              />
            </NewsletterSelectField>
            <OakFlex $flexDirection="column" $gap="spacing-12">
              <ResourcePageSchoolPicker
                hasError={false}
                schools={schools}
                label="School or organisation"
                schoolPickerInputValue={schoolPickerInputValue}
                setSchoolPickerInputValue={(value) => {
                  setSchoolNotListed(false);
                  setSchoolPickerInputValue(value);
                }}
                setSelectedSchool={setSelectedSchool}
                required={false}
                withHomeschool={false}
                placeholder="Type your school or organisation"
              />
              <OakCheckBox
                id="insights-newsletter-school-not-listed"
                name="schoolNotListed"
                value="not-listed"
                displayValue="My school isn't listed"
                checked={schoolNotListed}
                onChange={(event) => {
                  const isChecked = event.target.checked;
                  setSchoolNotListed(isChecked);
                  if (isChecked) {
                    setSelectedSchool(undefined);
                    setSchoolPickerInputValue("");
                  }
                }}
              />
            </OakFlex>
            <OakInputWithLabel
              label="Email"
              id="insights-newsletter-email"
              name="email"
              required
              defaultValue={email}
              error={fieldErrors.email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Type your email address"
              autocomplete="email"
            />
            <OakPrimaryButton
              type="submit"
              iconName="arrow-right"
              isTrailingIcon
              width="100%"
              isLoading={submitting}
            >
              {section.buttonLabel}
            </OakPrimaryButton>
            {submitError ? (
              <OakP
                role="alert"
                aria-live="assertive"
                $font="body-3"
                $color="text-error"
                $mv="spacing-0"
              >
                {submitError}
              </OakP>
            ) : null}
            {successMessage ? (
              <OakP
                role="status"
                aria-live="polite"
                $font="body-3"
                $mv="spacing-0"
              >
                {successMessage}
              </OakP>
            ) : null}
          </NewsletterForm>
        </NewsletterLayout>
      </NewsletterInner>
    </NewsletterSection>
  );
};

const FaqSection = styled(OakBox)`
  box-sizing: border-box;
`;

const FaqInner = styled(OakBox)`
  width: 100%;
  max-width: 956px;
`;

const FaqHeading = styled(OakHeading)`
  max-width: 632px;
`;

const FaqAccordionList = styled(OakFlex)`
  text-align: left;

  p,
  li {
    text-align: left;
  }

  /*
   * OakOutlineAccordion draws a rule above and below every item. Keep one rule
   * at each join when several accordions are presented as a single list.
   */
  > :not(:first-child) > :first-child {
    display: none;
  }
`;

export const NationalCurriculumInsightsFaq = ({
  section,
  data,
}: ContextualSectionProps<"NationalCurriculumInsightsFaqSection">) => (
  <FaqSection
    as="section"
    $background="bg-decorative2-very-subdued"
    $ph={["spacing-20", "spacing-40"]}
    $pv={
      data.route.kind === "guidance"
        ? "spacing-40"
        : ["spacing-48", "spacing-64"]
    }
    aria-labelledby="national-curriculum-insights-faq-heading"
    data-insights-module="faq"
  >
    <FaqInner $mh="auto">
      <FaqHeading
        tag="h2"
        id="national-curriculum-insights-faq-heading"
        $font="heading-4"
        $mb="spacing-32"
      >
        {section.heading}
      </FaqHeading>
      <FaqAccordionList $flexDirection="column">
        {section.items.map((item, index) => (
          <OakOutlineAccordion
            key={item.question}
            id={`national-curriculum-insights-faq-${index}`}
            initialOpen={index === 0}
            header={
              <OakHeading tag="h3" $font="heading-6">
                {item.question}
              </OakHeading>
            }
            $pv="spacing-12"
          >
            <PortableTextWithDefaults value={item.answerPortableText} />
          </OakOutlineAccordion>
        ))}
      </FaqAccordionList>
    </FaqInner>
  </FaqSection>
);
