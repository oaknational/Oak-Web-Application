"use client";

import { OakBox, OakFlex, OakHeading } from "@oaknational/oak-components";
import styled from "styled-components";

import { SectionProps } from "./shared";

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
