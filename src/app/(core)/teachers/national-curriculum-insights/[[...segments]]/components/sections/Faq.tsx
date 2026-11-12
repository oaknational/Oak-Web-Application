"use client";

import {
  OakBox,
  OakFlex,
  OakHandDrawnHR,
  OakHeading,
  OakFocusIndicator,
  OakIcon,
  OakMaxWidth,
} from "@oaknational/oak-components";
import { useState } from "react";

import { NationalCurriculumInsightsPortableText as PortableTextWithDefaults } from "../PortableText";

import { ContextualSectionProps } from "./shared";

import { useNationalCurriculumInsightsAnalytics } from "@/context/NationalCurriculumInsightsAnalytics/useNationalCurriculumInsightsAnalytics";

type FaqItem =
  ContextualSectionProps<"NationalCurriculumInsightsFaqSection">["section"]["items"][number];

const FaqAccordion = ({
  item,
  id,
  initialOpen,
}: {
  item: FaqItem;
  id: string;
  initialOpen: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const { trackCtaClicked, section: analyticsSection } =
    useNationalCurriculumInsightsAnalytics();
  return (
    <OakFlex $flexDirection="column" $pv="spacing-12" $gap="spacing-4">
      <OakFocusIndicator>
        <OakFlex
          as="button"
          type="button"
          id={id}
          aria-expanded={isOpen}
          aria-controls={`${id}-content`}
          $width="100%"
          $alignItems="center"
          $justifyContent="space-between"
          $background="transparent"
          $ba="border-solid-none"
          $pa="spacing-0"
          $color="text-primary"
          onClick={() => {
            trackCtaClicked({
              sectionType: "faq",
              sectionId: analyticsSection?.sectionId ?? "faq",
              componentType: "national_curriculum",
              ctaId: "faq-toggle",
              ctaText: item.question,
              ctaAction: isOpen ? "collapse" : "expand",
            });
            setIsOpen((open) => !open);
          }}
        >
          <OakHeading tag="h3" $font="heading-6" $textAlign="left">
            {item.question}
          </OakHeading>
          <OakIcon
            iconName="chevron-down"
            $width="spacing-32"
            $height="spacing-32"
            $mr="spacing-12"
            $transform={isOpen ? "rotate(180deg)" : "none"}
            $transition="standard-ease"
            alt="An arrow to indicate whether the item is open or closed"
          />
        </OakFlex>
      </OakFocusIndicator>
      <OakBox
        id={`${id}-content`}
        role="region"
        aria-labelledby={id}
        hidden={!isOpen}
      >
        <PortableTextWithDefaults value={item.answerPortableText} />
      </OakBox>
    </OakFlex>
  );
};

export const NationalCurriculumInsightsFaq = ({
  section,
  data,
}: ContextualSectionProps<"NationalCurriculumInsightsFaqSection">) => (
  <OakBox
    as="section"
    $boxSizing="border-box"
    $background="bg-decorative2-very-subdued"
    $pv={
      data.route.kind === "guidance"
        ? "spacing-40"
        : ["spacing-48", "spacing-64"]
    }
    aria-labelledby="national-curriculum-insights-faq-heading"
    data-insights-module="faq"
  >
    <OakMaxWidth $maxWidth="spacing-1280" $ph={["spacing-20", "spacing-40"]}>
      <OakBox $maxWidth="spacing-640">
        <OakHeading
          tag="h2"
          id="national-curriculum-insights-faq-heading"
          $font="heading-4"
          $mb="spacing-32"
        >
          {section.heading}
        </OakHeading>
      </OakBox>
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
            <FaqAccordion
              id={`national-curriculum-insights-faq-${index}`}
              initialOpen={index === 0}
              item={item}
            />
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
    </OakMaxWidth>
  </OakBox>
);
