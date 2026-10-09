"use client";

import {
  OakBox,
  OakFlex,
  OakGrid,
  OakHeading,
  OakIcon,
  OakImage,
  OakLI,
  OakMaxWidth,
} from "@oaknational/oak-components";

import { CurriculumJumpCard } from "./CurriculumJumpCard";
import type { ContextualSectionProps } from "./shared";

import { nationalCurriculumInsightsSubjectPhaseHref } from "@/common-lib/urls/nationalCurriculumInsights";

export const NationalCurriculumInsightsPhaseCards = ({
  section,
  data,
}: ContextualSectionProps<"NationalCurriculumInsightsPhaseCardsSection">) => {
  const subject = data.subject;
  if (!subject || data.route.kind === "subjectPhaseKeyStage") return null;

  const availablePhases = subject.tabs.map(({ kind }) => kind);
  const cards = section.cards.filter(
    ({ phase }) => phase !== data.activeTab && availablePhases.includes(phase),
  );
  if (!cards.length) return null;

  return (
    <OakBox $ph={["spacing-20", "spacing-40"]} $pv="spacing-40">
      <OakMaxWidth $maxWidth="spacing-1280" $ph="spacing-0">
        <OakGrid
          as="ul"
          $gridTemplateColumns={[
            "minmax(0, 1fr)",
            null,
            "repeat(2, minmax(0, 1fr))",
          ]}
          $cg="spacing-16"
          $rg="spacing-16"
          $ma="spacing-0"
          $pa="spacing-0"
          data-insights-module="phase-cards"
        >
          {cards.map(({ phase, heading }) => (
            <OakLI $listStyle="none" $width="100%" key={phase}>
              <CurriculumJumpCard
                href={nationalCurriculumInsightsSubjectPhaseHref(
                  subject.slug,
                  phase,
                )}
              >
                <OakFlex $width="100%" $gap="spacing-16" $alignItems="center">
                  <OakFlex
                    $width="spacing-72"
                    $height="spacing-72"
                    $flexShrink={0}
                    aria-hidden="true"
                  >
                    {phase === "primary" ? (
                      <OakIcon
                        iconName="homepage-three-pupils"
                        $width="spacing-72"
                        $height="spacing-72"
                      />
                    ) : (
                      <OakImage
                        src="/images/curriculum-change-explained/secondary.svg"
                        alt=""
                        $width="spacing-72"
                        $height="spacing-72"
                        $objectFit="contain"
                        unoptimized
                      />
                    )}
                  </OakFlex>
                  <OakFlex
                    $flexGrow={1}
                    $flexShrink={1}
                    $flexBasis={0}
                    $minWidth="spacing-0"
                  >
                    <OakHeading tag="h2" $font="heading-6">
                      {heading}
                    </OakHeading>
                  </OakFlex>
                  <OakIcon
                    iconName="arrow-right"
                    $width="spacing-32"
                    $height="spacing-32"
                    $minWidth="spacing-32"
                    aria-hidden="true"
                  />
                </OakFlex>
              </CurriculumJumpCard>
            </OakLI>
          ))}
        </OakGrid>
      </OakMaxWidth>
    </OakBox>
  );
};
