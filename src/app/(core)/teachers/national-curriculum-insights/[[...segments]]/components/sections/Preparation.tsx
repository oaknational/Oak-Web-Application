"use client";

import { useId } from "react";
import { OakFlex, OakHeading, OakBox, OakP } from "@oaknational/oak-components";

import { imageUrl, type SectionProps } from "./shared";

export const NationalCurriculumInsightsPreparation = ({
  section,
  variant = "phase",
}: SectionProps<"NationalCurriculumInsightsPreparationSection"> & {
  variant?: "phase" | "keyStage";
}) => {
  const headingId = `${useId()}-preparation-heading`;
  return (
    <OakFlex
      as="section"
      aria-labelledby={headingId}
      data-insights-module="preparation"
      $flexDirection="column"
      $gap="spacing-24"
      $width="100%"
    >
      <OakHeading id={headingId} tag="h2" $font="heading-4">
        {section.heading}
      </OakHeading>
      {section.steps.map((step) => (
        <OakFlex
          key={step.id}
          as="blockquote"
          $ma="spacing-0"
          $maxWidth="spacing-800"
          $width="100%"
          $gap="spacing-24"
        >
          <OakFlex
            aria-hidden="true"
            $width="spacing-8"
            $flexShrink={0}
            $background={
              variant === "keyStage"
                ? "bg-decorative3-main"
                : "bg-decorative1-main"
            }
          />
          <OakBox>
            <OakP $font="body-1-bold" $mv="spacing-0">
              {step.text}
            </OakP>
          </OakBox>
        </OakFlex>
      ))}
      <OakFlex $alignItems="center" $gap="spacing-12">
        {section.image?.asset?.url ? (
          <OakBox
            as="img"
            src={imageUrl(section.image)}
            alt=""
            width={54}
            height={54}
            loading="lazy"
            decoding="async"
            $borderRadius="border-radius-circle"
            $overflow="hidden"
          />
        ) : null}
        <OakFlex $flexDirection="column">
          <OakP $font="body-2-bold" $mv="spacing-0">
            {section.attribution}
          </OakP>
          <OakP $font="body-2" $mv="spacing-0">
            {section.role}
          </OakP>
        </OakFlex>
      </OakFlex>
    </OakFlex>
  );
};
