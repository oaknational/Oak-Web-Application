"use client";

import { OakBox, OakFlex, OakHeading } from "@oaknational/oak-components";
import { useId } from "react";
import styled from "styled-components";

import { NationalCurriculumInsightsPortableText as PortableTextWithDefaults } from "../PortableText";

import { SectionProps, InsightsContentMaxWidth } from "./shared";

export const NationalCurriculumInsightsRichText = ({
  section,
}: SectionProps<"NationalCurriculumInsightsRichTextSection">) => {
  const headingId = useId();

  return (
    <OakBox
      as="section"
      $ph={["spacing-20", "spacing-40"]}
      $pv="spacing-16"
      aria-labelledby={headingId}
    >
      <InsightsContentMaxWidth
        $mh="auto"
        $flexDirection="column"
        data-insights-module="rich-text"
      >
        <RichTextContent
          $flexDirection="column"
          $gap={section.headingStyle === "detail" ? "spacing-32" : "spacing-24"}
        >
          <OakHeading
            tag="h2"
            id={headingId}
            $font={
              section.headingStyle === "detail"
                ? "heading-7"
                : ["heading-5", "heading-4"]
            }
          >
            {section.heading}
          </OakHeading>
          <PortableTextWithDefaults value={section.contentPortableText} />
        </RichTextContent>
      </InsightsContentMaxWidth>
    </OakBox>
  );
};

const RichTextContent = styled(OakFlex)`
  width: 100%;
  max-width: 830px;
`;
