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

import {
  nationalCurriculumInsightsKeyStageSlug,
  type NationalCurriculumInsightsKeyStage,
} from "@/common-lib/cms-types/nationalCurriculumInsights";
import { nationalCurriculumInsightsSubjectPhaseKeyStageHref } from "@/common-lib/urls/nationalCurriculumInsights";

const illustration = (
  keyStage: NationalCurriculumInsightsKeyStage,
  isInsightPage: boolean,
) => {
  const phaseIllustrations = {
    KS1: { image: "KS3", height: "spacing-64", width: "auto", flip: true },
    KS2: { image: "KS2", height: "spacing-56", width: "auto", flip: false },
    KS3: { image: "KS1", height: "auto", width: "spacing-80", flip: true },
    KS4: { image: "KS4", height: "spacing-56", width: "auto", flip: false },
  } as const;
  const siblingIllustrations = {
    KS1: { image: "KS1", height: "spacing-48", width: "auto", flip: false },
    KS2: { image: "KS2", height: "spacing-48", width: "auto", flip: false },
    KS3: { image: "KS3", height: "spacing-48", width: "auto", flip: true },
    KS4: { image: "KS4", height: "spacing-56", width: "auto", flip: false },
  } as const;
  const images = isInsightPage ? siblingIllustrations : phaseIllustrations;
  const { image, height, width, flip } = images[keyStage];
  const aspectRatio = {
    KS1: 2096 / 1372,
    KS2: 1995 / 2169,
    KS3: 2176 / 2299,
    KS4: 2209 / 1847,
  }[image];

  return {
    src: `/images/curriculum-change-explained/${image.toLowerCase()}.png`,
    aspectRatio,
    width,
    height,
    transform: flip ? "scaleX(-1)" : undefined,
  } as const;
};

export const NationalCurriculumInsightsKeyStageCards = ({
  section,
  data,
}: ContextualSectionProps<"NationalCurriculumInsightsKeyStageCardsSection">) => {
  const { subject, activeTab, activeKeyStage } = data;
  if (!subject || !activeTab) return null;
  if (activeTab === "overview" && !section.linkFromSubjectOverview) return null;

  const isInsightPage = data.route.kind === "subjectPhaseKeyStage";
  const destinations = subject.tabs
    .filter(
      ({ kind }) =>
        isInsightPage || activeTab === "overview" || kind === activeTab,
    )
    .flatMap(({ kind: phase, page }) =>
      page.keyStages.map(({ keyStage }) => ({ keyStage, phase })),
    );
  const cards = section.cards.flatMap((card) => {
    const destination = destinations.find(
      ({ keyStage }) =>
        keyStage === card.keyStage && keyStage !== activeKeyStage,
    );
    return destination ? [{ ...card, phase: destination.phase }] : [];
  });
  if (!cards.length) return null;

  return (
    <OakBox
      $ph={isInsightPage ? "spacing-0" : ["spacing-20", "spacing-40"]}
      $pv={isInsightPage ? "spacing-24" : "spacing-40"}
    >
      <OakMaxWidth
        $maxWidth={isInsightPage ? "spacing-960" : "spacing-1280"}
        $ph="spacing-0"
      >
        {section.heading && (
          <OakHeading tag="h2" $font="heading-6" $mb="spacing-24">
            {section.heading}
          </OakHeading>
        )}
        <OakGrid
          as="ul"
          $gridTemplateColumns={[
            "minmax(0, 1fr)",
            null,
            "repeat(2, minmax(0, 1fr))",
          ]}
          $cg={isInsightPage ? "spacing-24" : "spacing-16"}
          $rg={isInsightPage ? "spacing-24" : "spacing-16"}
          $ma="spacing-0"
          $pa="spacing-0"
          data-insights-module="key-stage-cards"
        >
          {cards.map(({ keyStage, heading, phase }) => {
            const image = illustration(keyStage, isInsightPage);
            return (
              <OakLI $listStyle="none" $width="100%" key={keyStage}>
                <CurriculumJumpCard
                  minHeight={isInsightPage ? "spacing-100" : "spacing-120"}
                  href={nationalCurriculumInsightsSubjectPhaseKeyStageHref(
                    subject.slug,
                    phase,
                    nationalCurriculumInsightsKeyStageSlug(keyStage),
                  )}
                >
                  <OakFlex
                    $height={image.height}
                    $width={image.width}
                    $aspectRatio={image.aspectRatio}
                    $flexShrink={0}
                    $transform={image.transform}
                    aria-hidden="true"
                  >
                    <OakImage
                      src={image.src}
                      alt=""
                      $height="100%"
                      $width="100%"
                      $objectFit="contain"
                      unoptimized
                    />
                  </OakFlex>
                  <OakFlex
                    $flexGrow={1}
                    $flexShrink={1}
                    $flexBasis={0}
                    $minWidth="spacing-0"
                  >
                    <OakHeading
                      tag={section.heading ? "h3" : "h2"}
                      $font={isInsightPage ? "heading-7" : "heading-6"}
                    >
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
                </CurriculumJumpCard>
              </OakLI>
            );
          })}
        </OakGrid>
      </OakMaxWidth>
    </OakBox>
  );
};
