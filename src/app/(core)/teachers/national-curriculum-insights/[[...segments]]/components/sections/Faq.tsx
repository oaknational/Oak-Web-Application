"use client";

import {
  OakBasicAccordion,
  OakBox,
  OakFlex,
  OakHandDrawnHR,
  OakHeading,
} from "@oaknational/oak-components";

import { NationalCurriculumInsightsPortableText as PortableTextWithDefaults } from "../PortableText";

import { ContextualSectionProps } from "./shared";

export const NationalCurriculumInsightsFaq = ({
  section,
  data,
}: ContextualSectionProps<"NationalCurriculumInsightsFaqSection">) => (
  <OakBox
    as="section"
    $boxSizing="border-box"
    $background="bg-decorative2-very-subdued"
    $ph={["spacing-20", "spacing-40"]}
    $pv={
      data.route.kind === "guidance"
        ? "spacing-40"
        : ["spacing-48", "spacing-64"]
    }
    aria-labelledby="national-curriculum-insights-faq-heading"
    data-insights-module="faq"
  >
    <OakBox $width="100%" $maxWidth="spacing-960" $mh="auto">
      <OakHeading
        $maxWidth="spacing-640"
        tag="h2"
        id="national-curriculum-insights-faq-heading"
        $font="heading-4"
        $mb="spacing-32"
      >
        {section.heading}
      </OakHeading>
      <OakFlex $flexDirection="column" $textAlign="left" $gap="spacing-0">
        {section.items.map((item, index) => (
          <OakBox key={item.question} $position="relative">
            {index === 0 && (
              <OakHandDrawnHR
                $height="spacing-2"
                $width="100%"
                aria-hidden="true"
                data-testid="faq-divider"
              />
            )}
            <OakBasicAccordion
              id={`national-curriculum-insights-faq-${index}`}
              initialOpen={index === 0}
              header={
                <OakHeading tag="h3" $font="heading-6" $textAlign="left">
                  {item.question}
                </OakHeading>
              }
            >
              <PortableTextWithDefaults value={item.answerPortableText} />
            </OakBasicAccordion>
            <OakBox $position="absolute" $bottom="spacing-2" $width="100%">
              <OakHandDrawnHR
                $height="spacing-2"
                $width="100%"
                aria-hidden="true"
                data-testid="faq-divider"
              />
            </OakBox>
          </OakBox>
        ))}
      </OakFlex>
    </OakBox>
  </OakBox>
);
