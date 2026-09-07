"use client";

import {
  OakBox,
  OakFlex,
  OakHeading,
  OakOutlineAccordion,
} from "@oaknational/oak-components";
import styled from "styled-components";

import { NationalCurriculumInsightsPortableText as PortableTextWithDefaults } from "../NationalCurriculumInsightsPortableText";

import { ContextualSectionProps } from "./shared";

const FaqSection = styled(OakBox)`
  box-sizing: border-box;
`;

const FaqInner = styled(OakBox)`
  width: 100%;
  max-width: 956px;
`;

const FaqHeading = styled(OakHeading)`
  max-width: 632px;
`;

const FaqAccordionList = styled(OakFlex)`
  text-align: left;

  p,
  li {
    text-align: left;
  }

  /*
   * OakOutlineAccordion draws a rule above and below every item. Keep one rule
   * at each join when several accordions are presented as a single list.
   */
  > :not(:first-child) > :first-child {
    display: none;
  }
`;

export const NationalCurriculumInsightsFaq = ({
  section,
  data,
}: ContextualSectionProps<"NationalCurriculumInsightsFaqSection">) => (
  <FaqSection
    as="section"
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
    <FaqInner $mh="auto">
      <FaqHeading
        tag="h2"
        id="national-curriculum-insights-faq-heading"
        $font="heading-4"
        $mb="spacing-32"
      >
        {section.heading}
      </FaqHeading>
      <FaqAccordionList $flexDirection="column">
        {section.items.map((item, index) => (
          <OakOutlineAccordion
            key={item.question}
            id={`national-curriculum-insights-faq-${index}`}
            initialOpen={index === 0}
            header={
              <OakHeading tag="h3" $font="heading-6" $textAlign="left">
                {item.question}
              </OakHeading>
            }
            $pv="spacing-12"
          >
            <PortableTextWithDefaults value={item.answerPortableText} />
          </OakOutlineAccordion>
        ))}
      </FaqAccordionList>
    </FaqInner>
  </FaqSection>
);
