"use client";

import {
  OakBox,
  OakFlex,
  OakGrid,
  OakHeading,
  OakIcon,
  OakImage,
  OakLI,
  OakP,
} from "@oaknational/oak-components";

import { nationalCurriculumInsightsPhaseIllustration } from "../../helpers/presentation";

import { ContextualSectionProps, SectionMaxWidth } from "./shared";
import { CurriculumJumpCard as InsightsJumpCard } from "./CurriculumJumpCard";

import { nationalCurriculumInsightsSubjectPhaseHref } from "@/common-lib/urls/nationalCurriculumInsights";

export { NationalCurriculumInsightsKeyStageCards } from "./KeyStageCards";

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
        <OakGrid
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
            <OakLI
              $listStyle="none"
              $width="100%"
              key={`${card.phase}-${card.heading}`}
            >
              <InsightsJumpCard
                minHeight="spacing-240"
                href={nationalCurriculumInsightsSubjectPhaseHref(
                  subjectSlug,
                  card.phase,
                )}
              >
                <OakFlex
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
                </OakFlex>
                <OakFlex
                  $flexGrow={1}
                  $flexShrink={1}
                  $flexBasis={0}
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
            </OakLI>
          ))}
        </OakGrid>
      </SectionMaxWidth>
    </OakBox>
  );
};
