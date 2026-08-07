"use client";

import type { PortableTextComponents } from "@portabletext/react";
import {
  getMediaQuery,
  isValidIconName,
  OakBox,
  OakCard,
  OakCheckBox,
  OakFlex,
  OakHeading,
  OakImage,
  OakJauntyAngleLabel,
  OakLink,
  OakOutlineAccordion,
  OakP,
  OakPrimaryButton,
  OakQuote,
  OakSubjectIconButton,
} from "@oaknational/oak-components";
import Link from "next/link";
import { FormEvent, useId, useState } from "react";
import styled from "styled-components";

import type { NationalCurriculumInsightsRouteData } from "./getNationalCurriculumInsightsData";

import { nationalCurriculumInsightsKeyStageSlug } from "@/common-lib/cms-types/nationalCurriculumInsights";
import {
  nationalCurriculumInsightsSubjectHref,
  nationalCurriculumInsightsSubjectPhaseHref,
  nationalCurriculumInsightsSubjectPhaseKeyStageHref,
} from "@/common-lib/urls/nationalCurriculumInsights";
import { EDU_ROLES } from "@/browser-lib/hubspot/forms/getHubspotFormPayloads";
import getProxiedSanityAssetUrl from "@/common-lib/urls/getProxiedSanityAssetUrl";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";
import { OakInputWithLabel } from "@/components/SharedComponents/OakInputWithLabel/OakInputWithLabel";

type Page = NonNullable<NationalCurriculumInsightsRouteData["page"]>;
type InsightSection = Page["modules"][number];
type Subject = NationalCurriculumInsightsRouteData["hub"]["subjects"][number];
type Phase = "primary" | "secondary";

type SectionProps<T extends InsightSection["__typename"]> = {
  section: Extract<InsightSection, { __typename: T }>;
};

type ContextualSectionProps<T extends InsightSection["__typename"]> =
  SectionProps<T> & {
    data: NationalCurriculumInsightsRouteData;
  };

const DEFAULT_IMAGE = "/images/national-curriculum-insights/hero.jpg";

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
      <OakP $font="body-1" $mv="spacing-0">
        {children}
      </OakP>
    ),
  },
};

const SectionMaxWidth = styled(OakBox)`
  width: 100%;
  max-width: 1221px;
`;

const OverviewPanel = styled(SectionMaxWidth)`
  display: grid;
  grid-template-areas:
    "heading"
    "image"
    "body";
  gap: 24px;

  @media (${getMediaQuery("desktop")}) {
    grid-template-columns: minmax(0, 1fr) 332px;
    grid-template-areas:
      "heading image"
      "body image";
    column-gap: 40px;
    row-gap: 24px;
  }
`;

const OverviewHeading = styled(OakHeading)`
  grid-area: heading;
`;

const OverviewBody = styled(OakBox)`
  grid-area: body;
`;

const OverviewImage = styled(OakBox)`
  grid-area: image;
  width: 100%;
  aspect-ratio: 332 / 259;
  overflow: hidden;
`;

export const NationalCurriculumInsightsOverview = ({
  section,
}: SectionProps<"NationalCurriculumInsightsOverviewSection">) => {
  const headingId = useId();

  return (
    <OakBox
      $ph={["spacing-20", "spacing-40"]}
      $pv={["spacing-32", "spacing-48"]}
    >
      <OverviewPanel
        as="section"
        $mh="auto"
        $background="bg-decorative2-subdued"
        $pa={["spacing-24", "spacing-40"]}
        $borderRadius="border-radius-l"
        aria-labelledby={headingId}
      >
        <OverviewHeading
          id={headingId}
          tag="h2"
          $font={["heading-4", "heading-3"]}
        >
          {section.heading}
        </OverviewHeading>
        <OverviewBody>
          <PortableTextWithDefaults
            value={section.bodyPortableText}
            components={portableTextComponents}
          />
        </OverviewBody>
        <OverviewImage
          aria-hidden={section.image.isPresentational || undefined}
        >
          <OakImage
            src={imageUrl(
              section.image,
              "/images/national-curriculum-insights/overview.png",
            )}
            alt={imageAlt(section.image)}
            $width="100%"
            $height="100%"
            $objectFit="cover"
          />
        </OverviewImage>
      </OverviewPanel>
    </OakBox>
  );
};

const PhaseCardList = styled.ul`
  display: grid;
  grid-template-columns: minmax(0, 416px);
  justify-content: center;
  gap: 32px;
  list-style: none;
  margin: 0;
  padding: 0;

  @media (${getMediaQuery("desktop")}) {
    grid-template-columns: repeat(2, minmax(0, 416px));
    gap: 64px;
  }
`;

const PhaseCardItem = styled.li`
  width: 100%;
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
        <PhaseCardList>
          {section.cards.map((card) => (
            <PhaseCardItem key={`${card.phase}-${card.heading}`}>
              <OakCard
                heading={card.heading}
                headingLevel="h2"
                href={nationalCurriculumInsightsSubjectPhaseHref(
                  subjectSlug,
                  card.phase,
                )}
                imageSrc={imageUrl(card.image)}
                imageAlt={imageAlt(card.image)}
                aspectRatio="4/3"
                linkText={card.linkLabel}
                linkIconName="arrow-right"
              />
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
        <PhaseCardList>
          {cards.map((card) => (
            <PhaseCardItem key={`${card.keyStage}-${card.heading}`}>
              <OakCard
                heading={card.heading}
                headingLevel="h2"
                href={nationalCurriculumInsightsSubjectPhaseKeyStageHref(
                  data.subject!.slug,
                  phase,
                  nationalCurriculumInsightsKeyStageSlug(card.keyStage),
                )}
                imageSrc={imageUrl(card.image)}
                imageAlt={imageAlt(card.image)}
                aspectRatio="4/3"
                linkText={card.linkLabel}
                linkIconName="arrow-right"
              />
            </PhaseCardItem>
          ))}
        </PhaseCardList>
      </SectionMaxWidth>
    </OakBox>
  );
};

const PromotionalHeading = styled(OakFlex)`
  position: relative;
  width: fit-content;
  max-width: 680px;
  background: #b8e5e2;
  min-height: 49px;

  &::before {
    content: "";
    position: absolute;
    left: 12px;
    top: -5px;
    width: 3px;
    height: calc(100% + 10px);
    background: #222222;
    transform: rotate(-2deg);
  }

  @media (${getMediaQuery("desktop")}) {
    min-height: 81px;
  }
`;

export const NationalCurriculumInsightsPromotionalHeading = ({
  section,
}: SectionProps<"NationalCurriculumInsightsPromotionalHeadingSection">) => (
  <OakBox $ph={["spacing-20", "spacing-40"]} $pv={["spacing-32", "spacing-48"]}>
    <PromotionalHeading
      $mh="auto"
      $maxWidth="spacing-680"
      $alignItems="center"
      $justifyContent="center"
      $ph="spacing-24"
      $borderRadius="border-radius-m"
    >
      <OakHeading
        tag="h2"
        $font={["heading-5", "heading-1"]}
        $textAlign="center"
      >
        {section.heading}
      </OakHeading>
    </PromotionalHeading>
  </OakBox>
);

const SubjectList = styled(OakFlex)`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const HubSubjectItem = styled.li`
  width: 225px;

  > * {
    width: 100%;
  }
`;

const HubSubjectList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  list-style: none;
  margin: 0;
  padding: 0;
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
        : section.phases[0];
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
        <SectionMaxWidth $mh="auto">
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
                  selected={data.subject?.slug === subject.slug}
                >
                  {subject.title}
                </OakSubjectIconButton>
              </li>
            ))}
          </SubjectList>
        </SectionMaxWidth>
      </OakBox>
    );
  }

  return (
    <OakBox
      $ph={["spacing-20", "spacing-40"]}
      $pb={["spacing-48", "spacing-64"]}
    >
      <SectionMaxWidth $mh="auto">
        <OakFlex $flexDirection="column" $gap="spacing-48">
          {section.phases.map((phase) => (
            <nav
              key={phase}
              aria-labelledby={`national-curriculum-insights-${phase}-subjects`}
            >
              <OakFlex
                $flexDirection="column"
                $gap="spacing-24"
                $alignItems="center"
              >
                <OakHeading
                  tag="h3"
                  id={`national-curriculum-insights-${phase}-subjects`}
                  $font="heading-4"
                  $textAlign="center"
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
            </nav>
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

export const NationalCurriculumInsightsImageText = ({
  section,
}: SectionProps<"NationalCurriculumInsightsImageTextSection">) => {
  const headingId = useId();

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

const VideoCardFrame = styled.div`
  width: 100%;
  max-width: 384px;
`;

const VideoCardList = styled.ul`
  display: grid;
  grid-template-columns: minmax(0, 384px);
  justify-content: center;
  gap: 32px;
  list-style: none;
  margin: 0;
  padding: 0;

  @media (${getMediaQuery("desktop")}) {
    grid-template-columns: repeat(3, minmax(0, 384px));
  }
`;

const VideoCardItem = styled.li`
  width: 100%;
`;

const VideoCardsSection = styled(OakBox)`
  @media (${getMediaQuery("desktop")}) {
    min-height: 1343px;
    display: flex;
    align-items: center;
  }
`;

const QuoteImage = styled(OakBox)`
  width: 100%;
  height: 320px;
  overflow: hidden;

  @media (${getMediaQuery("desktop")}) {
    width: 480px;
  }
`;

const QuoteSection = styled(OakBox)`
  @media (${getMediaQuery("desktop")}) {
    min-height: 596px;
    display: flex;
    align-items: center;
  }
`;

export const NationalCurriculumInsightsVideoCards = ({
  section,
}: SectionProps<"NationalCurriculumInsightsVideoCardsSection">) => {
  const headingId = useId();
  const [featured, ...remaining] = section.cards;

  return (
    <VideoCardsSection
      as="section"
      $background="bg-decorative1-very-subdued"
      $ph={["spacing-20", "spacing-40"]}
      $pv={["spacing-48", "spacing-64"]}
      aria-labelledby={headingId}
    >
      <SectionMaxWidth $mh="auto">
        <OakFlex $flexDirection="column" $gap="spacing-32">
          <OakFlex
            $flexDirection={["column", "column", "row"]}
            $alignItems="center"
            $justifyContent="space-between"
            $gap={["spacing-32", "spacing-64"]}
          >
            <OakFlex
              $flexDirection="column"
              $gap="spacing-24"
              $maxWidth="spacing-480"
            >
              <OakHeading
                tag="h2"
                id={headingId}
                $font={["heading-4", "heading-2"]}
              >
                {section.heading}
              </OakHeading>
              {section.introductionPortableText ? (
                <PortableTextWithDefaults
                  value={section.introductionPortableText}
                  components={portableTextComponents}
                />
              ) : null}
            </OakFlex>
            {featured ? (
              <VideoCardFrame>
                <OakCard
                  heading={featured.heading}
                  headingLevel="h3"
                  href={featured.videoUrl}
                  imageSrc={imageUrl(featured.image)}
                  imageAlt={imageAlt(featured.image)}
                  aspectRatio="4/3"
                  subCopy={featured.description}
                  tagName={featured.duration ?? undefined}
                  linkText="Watch episode"
                  linkIconName="play"
                />
              </VideoCardFrame>
            ) : null}
          </OakFlex>
          {remaining.length > 0 ? (
            <VideoCardList>
              {remaining.map((card) => (
                <VideoCardItem key={`${card.heading}-${card.videoUrl}`}>
                  <OakCard
                    heading={card.heading}
                    headingLevel="h3"
                    href={card.videoUrl}
                    imageSrc={imageUrl(card.image)}
                    imageAlt={imageAlt(card.image)}
                    aspectRatio="4/3"
                    subCopy={card.description}
                    tagName={card.duration ?? undefined}
                    linkText="Watch episode"
                    linkIconName="play"
                  />
                </VideoCardItem>
              ))}
            </VideoCardList>
          ) : null}
        </OakFlex>
      </SectionMaxWidth>
    </VideoCardsSection>
  );
};

export const NationalCurriculumInsightsQuote = ({
  section,
}: SectionProps<"NationalCurriculumInsightsQuoteSection">) => {
  const authorImageSrc = section.image?.asset?.url
    ? getProxiedSanityAssetUrl(section.image.asset.url)
    : undefined;

  return (
    <QuoteSection
      as="section"
      $ph={["spacing-20", "spacing-40"]}
      $pv={["spacing-48", "spacing-64"]}
    >
      <SectionMaxWidth $mh="auto">
        <OakFlex
          $flexDirection={["column", "column", "row"]}
          $alignItems="center"
          $justifyContent="space-between"
          $gap={["spacing-32", "spacing-64"]}
        >
          <OakBox $maxWidth="spacing-600">
            <OakQuote
              quote={section.quote}
              authorName={section.attribution}
              authorTitle={section.role ?? undefined}
              color="text-primary"
              hasLeftBorder={false}
            />
          </OakBox>
          {authorImageSrc ? (
            <QuoteImage $position="relative">
              <OakImage
                src={authorImageSrc}
                alt={imageAlt(section.image)}
                $width="100%"
                $height="100%"
                $objectFit="cover"
              />
            </QuoteImage>
          ) : null}
        </OakFlex>
      </SectionMaxWidth>
    </QuoteSection>
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
      $pv={["spacing-32", "spacing-48"]}
      aria-labelledby={headingId}
    >
      <OakFlex
        $mh="auto"
        $maxWidth="spacing-960"
        $flexDirection="column"
        $gap="spacing-24"
      >
        <OakHeading tag="h2" id={headingId} $font={["heading-4", "heading-3"]}>
          {section.heading}
        </OakHeading>
        <PortableTextWithDefaults value={section.contentPortableText} />
      </OakFlex>
    </OakBox>
  );
};

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
  border: 2px solid #222222;
  border-radius: 8px;
  overflow: hidden;

  th,
  td {
    padding: 16px 20px;
    border-right: 1px solid #222222;
    border-bottom: 1px solid #222222;
    text-align: left;
    vertical-align: top;
  }

  th {
    background: #b6f2b3;
    font-weight: 700;
  }

  tbody tr:nth-child(odd) td {
    background: #e8f8e7;
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
  const headingId = useId();

  return (
    <OakBox
      as="section"
      $ph={["spacing-20", "spacing-40"]}
      $pv={["spacing-32", "spacing-48"]}
      aria-labelledby={headingId}
    >
      <SectionMaxWidth $mh="auto">
        <OakFlex $flexDirection="column" $gap="spacing-24">
          <OakHeading
            tag="h2"
            id={headingId}
            $font={["heading-4", "heading-3"]}
          >
            {section.heading}
          </OakHeading>
          <TableScroll>
            <InsightsTable>
              <thead>
                <tr>
                  {section.table.rows[0]?.cells.map((cell, cellIndex) => (
                    <th
                      scope="col"
                      key={`${section.heading}-head-${cellIndex}`}
                    >
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
        </OakFlex>
      </SectionMaxWidth>
    </OakBox>
  );
};

const NewsletterList = styled(OakFlex)`
  list-style: disc;
  margin: 0;
  padding-left: 24px;
`;

const NewsletterSection = styled(OakBox)`
  @media (${getMediaQuery("desktop")}) {
    min-height: 600px;
    display: flex;
    align-items: center;
  }
`;

const NewsletterSelect = styled.select`
  box-sizing: border-box;
  width: 100%;
  min-height: 56px;
  padding: 12px 16px;
  border: 2px solid #222222;
  border-radius: 4px;
  background: #ffffff;
  color: #222222;
  font: inherit;
`;

export const NationalCurriculumInsightsNewsletter = ({
  section,
}: SectionProps<"NationalCurriculumInsightsNewsletterSection">) => {
  const [submitted, setSubmitted] = useState(false);
  const [role, setRole] = useState("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <NewsletterSection
      as="section"
      $background="bg-decorative5-very-subdued"
      $ph={["spacing-20", "spacing-40"]}
      $pv={["spacing-48", "spacing-64"]}
      aria-labelledby="national-curriculum-insights-newsletter-heading"
    >
      <SectionMaxWidth $mh="auto">
        <OakFlex
          $flexDirection={["column", "column", "row"]}
          $gap={["spacing-40", "spacing-64"]}
          $alignItems="stretch"
          $justifyContent="space-between"
        >
          <OakFlex
            $flexDirection="column"
            $gap="spacing-24"
            $maxWidth="spacing-600"
          >
            <OakFlex $alignItems="center" $gap="spacing-16">
              <OakImage
                src={imageUrl(
                  section.illustration,
                  "/images/national-curriculum-insights/newsletter.png",
                )}
                alt={imageAlt(section.illustration)}
                $width="spacing-80"
                $height="spacing-80"
                $objectFit="cover"
                aria-hidden={section.illustration.isPresentational || undefined}
              />
              <OakHeading
                tag="h2"
                id="national-curriculum-insights-newsletter-heading"
                $font={["heading-4", "heading-2"]}
              >
                {section.heading}
              </OakHeading>
            </OakFlex>
            <OakP $font="body-1">{section.introduction}</OakP>
            <NewsletterList as="ul" $flexDirection="column" $gap="spacing-16">
              {section.benefits.map((benefit) => (
                <li key={benefit}>
                  <OakP $font="body-2" $mv="spacing-0">
                    {benefit}
                  </OakP>
                </li>
              ))}
            </NewsletterList>
            <PortableTextWithDefaults value={section.privacyPortableText} />
          </OakFlex>

          <OakFlex
            as="form"
            onSubmit={onSubmit}
            $gap="spacing-32"
            $flexDirection="column"
            $minWidth={["100%", "100%", "spacing-480"]}
            data-form-id={section.formId ?? undefined}
          >
            <OakInputWithLabel
              label="Name"
              id="insights-newsletter-name"
              name="name"
              required
              onChange={() => undefined}
              placeholder="Type your name"
              autocomplete="name"
            />
            <OakBox $position="relative">
              <OakJauntyAngleLabel
                label="Role"
                htmlFor="insights-newsletter-role"
                as="label"
                $font="heading-7"
                $background="bg-decorative5-main"
                $color="text-primary"
                $position="absolute"
                $top="-20px"
                $left="5px"
                $zIndex="in-front"
                $borderRadius="border-radius-square"
              />
              <NewsletterSelect
                id="insights-newsletter-role"
                name="role"
                value={role}
                onChange={(event) => setRole(event.target.value)}
              >
                <option value="">Select your role</option>
                {EDU_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </NewsletterSelect>
            </OakBox>
            <OakInputWithLabel
              label="School or organisation"
              id="insights-newsletter-school"
              name="school"
              required={false}
              onChange={() => undefined}
              placeholder="Type your school or organisation"
              autocomplete="organization"
            />
            <OakCheckBox
              id="insights-newsletter-school-not-listed"
              name="schoolNotListed"
              value="not-listed"
              displayValue="My school isn't listed"
            />
            <OakInputWithLabel
              label="Email"
              id="insights-newsletter-email"
              name="email"
              required
              onChange={() => undefined}
              placeholder="Type your email address"
              autocomplete="email"
            />
            <OakPrimaryButton
              type="submit"
              iconName="arrow-right"
              isTrailingIcon
              width="100%"
            >
              {section.buttonLabel}
            </OakPrimaryButton>
            {submitted ? (
              <OakP role="status" $font="body-3" $mv="spacing-0">
                Preview only: form submission is disabled.
              </OakP>
            ) : null}
          </OakFlex>
        </OakFlex>
      </SectionMaxWidth>
    </NewsletterSection>
  );
};

const FaqSection = styled(OakBox)<{ $isHub: boolean }>`
  @media (${getMediaQuery("desktop")}) {
    min-height: ${({ $isHub }) => ($isHub ? "800px" : "540px")};
    display: flex;
    align-items: center;
  }
`;

const FaqAccordionList = styled(OakFlex)`
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
    $isHub={data.route.kind === "hub"}
    as="section"
    $background="bg-decorative2-very-subdued"
    $ph={["spacing-20", "spacing-40"]}
    $pv={["spacing-48", "spacing-64"]}
    aria-labelledby="national-curriculum-insights-faq-heading"
  >
    <OakBox $mh="auto" $maxWidth="spacing-960">
      <OakHeading
        tag="h2"
        id="national-curriculum-insights-faq-heading"
        $font="heading-4"
        $mb="spacing-32"
      >
        {section.heading}
      </OakHeading>
      <FaqAccordionList $flexDirection="column">
        {section.items.map((item, index) => (
          <OakOutlineAccordion
            key={item.question}
            id={`national-curriculum-insights-faq-${index}`}
            initialOpen={item.initiallyExpanded ?? false}
            header={
              <OakHeading tag="h3" $font="heading-6">
                {item.question}
              </OakHeading>
            }
            $pv="spacing-16"
          >
            <PortableTextWithDefaults value={item.answerPortableText} />
          </OakOutlineAccordion>
        ))}
      </FaqAccordionList>
    </OakBox>
  </FaqSection>
);
