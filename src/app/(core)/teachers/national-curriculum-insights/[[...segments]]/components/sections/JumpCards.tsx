"use client";

import {
  OakBox,
  OakFlex,
  OakGrid,
  OakHeading,
  OakIcon,
  OakImage,
  OakP,
  parseColor,
} from "@oaknational/oak-components";
import Link from "next/link";
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

const PhaseCardList = styled(OakGrid)`
  justify-content: center;
  gap: 17px;
  list-style: none;
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
  flex: 0 0 72px;
`;

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
        <PhaseCardList
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
                $height={240}
                href={nationalCurriculumInsightsSubjectPhaseHref(
                  subjectSlug,
                  card.phase,
                )}
              >
                <JumpCardImage
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
                </JumpCardImage>
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
        <PhaseCardList
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
                $height={246}
                href={nationalCurriculumInsightsSubjectPhaseKeyStageHref(
                  data.subject!.slug,
                  phase,
                  nationalCurriculumInsightsKeyStageSlug(card.keyStage),
                )}
              >
                <JumpCardImage
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
                </JumpCardImage>
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
        </PhaseCardList>
      </SectionMaxWidth>
    </OakBox>
  );
};
