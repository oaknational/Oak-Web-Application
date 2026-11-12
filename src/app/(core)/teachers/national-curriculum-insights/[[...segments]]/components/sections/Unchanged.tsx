"use client";

import { useId } from "react";
import { OakFlex, OakHeading } from "@oaknational/oak-components";

import { NationalCurriculumInsightsPortableText } from "../PortableText";

import { guidancePortableTextComponents, type SectionProps } from "./shared";

export const NationalCurriculumInsightsUnchanged = ({
  section,
}: SectionProps<"NationalCurriculumInsightsUnchangedSection">) => {
  const headingId = `${useId()}-unchanged-heading`;
  return (
    <OakFlex
      as="section"
      aria-labelledby={headingId}
      data-insights-module="unchanged"
      $flexDirection="column"
      $gap="spacing-24"
      $width="100%"
    >
      <OakHeading id={headingId} tag="h2" $font="heading-4">
        {section.heading}
      </OakHeading>
      <OakFlex $flexDirection="column" $gap="spacing-24">
        <NationalCurriculumInsightsPortableText
          value={section.contentPortableText}
          components={guidancePortableTextComponents}
        />
      </OakFlex>
    </OakFlex>
  );
};
