"use client";

import {
  OakBox,
  OakFlex,
  OakGrid,
  OakHeading,
  OakIcon,
  OakImage,
  OakP,
  OakAllSpacingToken,
  OakFocusIndicator,
} from "@oaknational/oak-components";
import Link from "next/link";
import type { ReactNode } from "react";
import styled from "styled-components";

import {
  nationalCurriculumInsightsKeyStageIllustration,
  nationalCurriculumInsightsPhaseIllustration,
} from "../../helpers/presentation";

import { ContextualSectionProps, SectionMaxWidth } from "./shared";

import { nationalCurriculumInsightsKeyStageSlug } from "@/common-lib/cms-types/nationalCurriculumInsights";
import {
  nationalCurriculumInsightsSubjectPhaseHref,
  nationalCurriculumInsightsSubjectPhaseKeyStageHref,
} from "@/common-lib/urls/nationalCurriculumInsights";

const JumpCardList = styled(OakGrid)`
  list-style: none;
`;

const InsightsJumpCard = ({
  minHeight,
  href,
  children,
}: {
  minHeight: OakAllSpacingToken;
  href: string;
  children: ReactNode;
}) => (
  <OakFocusIndicator
    $width="100%"
    $background="bg-primary"
    $borderRadius="border-radius-m2"
    hoverBackground="bg-neutral"
  >
    <OakFlex
      as={Link}
      href={href}
      $alignItems="center"
      $gap="spacing-16"
      $width="100%"
      $minHeight={minHeight}
      $pa="spacing-16"
      $ba="border-solid-s"
      $borderColor="border-neutral-lighter"
      $borderRadius="border-radius-m2"
      $color="text-primary"
      $textDecoration="none"
    >
      {children}
    </OakFlex>
  </OakFocusIndicator>
);

export const NationalCurriculumInsightsPhaseCards = ({
  section,
  data,
}: ContextualSectionProps<"NationalCurriculumInsightsPhaseCardsSection">) => {
  const subjectSlug = data.subject?.slug;
  if (!subjectSlug) {
    return null;
  }

  const cards = section.cards.filter(({ phase }) =>
    data.subject?.tabs.some(({ kind }) => kind === phase),
  );
  if (cards.length === 0) return null;

  return (
    <OakBox
      $ph={["spacing-20", "spacing-40"]}
      $pv={["spacing-32", "spacing-48"]}
    >
      <SectionMaxWidth $mh="auto">
        <JumpCardList
          $cg="spacing-16"
          $rg="spacing-16"
          as="ul"
          $gridTemplateColumns={[
            "minmax(0, 1fr)",
            null,
            "repeat(2, minmax(0, 1fr))",
          ]}
          $ma="spacing-0"
          $pa="spacing-0"
          data-insights-module="phase-cards"
        >
          {cards.map((card) => (
            <OakBox as="li" $width="100%" key={`${card.phase}-${card.heading}`}>
              <InsightsJumpCard
                minHeight="spacing-240"
                href={nationalCurriculumInsightsSubjectPhaseHref(
                  subjectSlug,
                  card.phase,
                )}
              >
                <OakBox
                  $flexShrink={0}
                  $width="spacing-72"
                  $height="spacing-72"
                  $overflow="hidden"
                  aria-hidden="true"
                >
                  <OakImage
                    src={nationalCurriculumInsightsPhaseIllustration(
                      card.phase,
                    )}
                    alt=""
                    $width="100%"
                    $height="100%"
                    $objectFit="contain"
                  />
                </OakBox>
                <OakFlex
                  $flexGrow={1}
                  $flexShrink={1}
                  $flexBasis="0%"
                  $alignSelf="stretch"
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
                </OakFlex>
                <OakIcon
                  iconName="arrow-right"
                  $width="spacing-32"
                  $height="spacing-32"
                />
              </InsightsJumpCard>
            </OakBox>
          ))}
        </JumpCardList>
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
        <JumpCardList
          $cg="spacing-16"
          $rg="spacing-16"
          as="ul"
          $gridTemplateColumns={[
            "minmax(0, 1fr)",
            null,
            "repeat(2, minmax(0, 1fr))",
          ]}
          $ma="spacing-0"
          $pa="spacing-0"
          data-insights-module="key-stage-cards"
        >
          {cards.map((card) => (
            <OakBox
              as="li"
              $width="100%"
              key={`${card.keyStage}-${card.heading}`}
            >
              <InsightsJumpCard
                minHeight="spacing-240"
                href={nationalCurriculumInsightsSubjectPhaseKeyStageHref(
                  data.subject!.slug,
                  phase,
                  nationalCurriculumInsightsKeyStageSlug(card.keyStage),
                )}
              >
                <OakBox
                  $flexShrink={0}
                  $width="spacing-72"
                  $height="spacing-72"
                  $overflow="hidden"
                  aria-hidden="true"
                >
                  <OakImage
                    src={nationalCurriculumInsightsKeyStageIllustration(
                      card.keyStage,
                    )}
                    alt=""
                    $width="100%"
                    $height="100%"
                    $objectFit="contain"
                  />
                </OakBox>
                <OakFlex
                  $flexGrow={1}
                  $flexShrink={1}
                  $flexBasis="0%"
                  $alignSelf="stretch"
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
                </OakFlex>
                <OakIcon
                  iconName="arrow-right"
                  $width="spacing-32"
                  $height="spacing-32"
                />
              </InsightsJumpCard>
            </OakBox>
          ))}
        </JumpCardList>
      </SectionMaxWidth>
    </OakBox>
  );
};
