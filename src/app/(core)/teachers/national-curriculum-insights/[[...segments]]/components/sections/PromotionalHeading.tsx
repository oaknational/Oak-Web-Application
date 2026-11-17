"use client";

import { OakBox, OakFlex, OakHeading } from "@oaknational/oak-components";

import { SectionProps } from "./shared";

export const NationalCurriculumInsightsPromotionalHeading = ({
  section,
}: SectionProps<"NationalCurriculumInsightsPromotionalHeadingSection">) => {
  return (
    <OakBox
      $ph={["spacing-20", "spacing-40"]}
      $pv={["spacing-32", "spacing-48"]}
    >
      <OakFlex
        $boxSizing="border-box"
        $width="100%"
        $maxWidth="spacing-1280"
        $ph={["spacing-0", "spacing-0", "spacing-80"]}
        $justifyContent="center"
        $textAlign="center"
        $mh="auto"
        $alignItems="center"
        data-insights-module="promotional-heading"
      >
        <OakHeading tag="h2" $font={["heading-5", "heading-4"]}>
          {section.heading}
        </OakHeading>
      </OakFlex>
    </OakBox>
  );
};
