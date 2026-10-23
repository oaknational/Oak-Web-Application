"use client";

import { useId, useState } from "react";
import {
  OakBox,
  OakFlex,
  OakHeading,
  OakFocusIndicator,
  OakHandDrawnHR,
  OakIcon,
  OakP,
} from "@oaknational/oak-components";
import type { PortableTextComponents } from "@portabletext/react";

import { NationalCurriculumInsightsPortableText } from "../PortableText";

import type { SectionProps } from "./shared";

const detailComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <OakP $font="body-2" $mv="spacing-0" $wordWrap="break-word">
        {children}
      </OakP>
    ),
  },
};

type ChangeDetailsProps = {
  change: SectionProps<"NationalCurriculumInsightsChangesSection">["section"]["changes"][number];
  id: string;
  initialOpen: boolean;
};

const ChangeDetails = ({ change, id, initialOpen }: ChangeDetailsProps) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const contentId = `${id}-content`;

  return (
    <OakFlex $flexDirection="column" $gap="spacing-12" $width="100%">
      <OakHandDrawnHR aria-hidden="true" $width="100%" $height="spacing-2" />
      <OakFocusIndicator $width="100%">
        <OakFlex
          as="button"
          type="button"
          id={id}
          aria-expanded={isOpen}
          aria-controls={contentId}
          onClick={() => setIsOpen((open) => !open)}
          $width="100%"
          $pa="spacing-0"
          $ba="border-solid-none"
          $background="bg-primary"
          $color="text-primary"
          $alignItems="center"
          $gap="spacing-16"
        >
          <OakFlex $flexDirection="column" $flexGrow={1} $minWidth="spacing-0">
            <OakP
              as="span"
              $font="heading-light-6"
              $textAlign="left"
              $mv="spacing-0"
              $wordWrap="break-word"
            >
              {change.whyItMatters}
            </OakP>
          </OakFlex>
          <OakFlex
            $flexShrink={0}
            $transform={isOpen ? "rotate(180deg)" : "none"}
            $transition="standard-ease"
          >
            <OakIcon
              iconName="chevron-down"
              $width="spacing-32"
              $height="spacing-32"
              alt=""
            />
          </OakFlex>
        </OakFlex>
      </OakFocusIndicator>
      <OakBox
        id={contentId}
        role="region"
        aria-labelledby={id}
        hidden={!isOpen}
        $width="100%"
      >
        <OakFlex $flexDirection="column" $gap="spacing-12">
          <NationalCurriculumInsightsPortableText
            value={change.detailPortableText}
            components={detailComponents}
          />
        </OakFlex>
      </OakBox>
    </OakFlex>
  );
};

export const NationalCurriculumInsightsChanges = ({
  section,
}: SectionProps<"NationalCurriculumInsightsChangesSection">) => {
  const instanceId = useId();
  const headingId = `${instanceId}-changes-heading`;
  return (
    <OakFlex
      as="section"
      aria-labelledby={headingId}
      data-insights-module="changes"
      $flexDirection="column"
      $gap="spacing-48"
      $width="100%"
    >
      <OakHeading
        id={headingId}
        tag="h2"
        $font="heading-4"
        $wordWrap="break-word"
      >
        {section.heading}
      </OakHeading>
      {section.changes.map((change, index) => (
        <OakFlex
          key={change.id}
          $flexDirection="column"
          $alignItems="flex-start"
          $gap="spacing-32"
          $width="100%"
        >
          <OakBox
            $background="bg-decorative3-very-subdued"
            $ph="spacing-4"
            $maxWidth="100%"
          >
            <OakHeading tag="h3" $font="heading-5" $wordWrap="break-word">
              {change.title}
            </OakHeading>
          </OakBox>
          <ChangeDetails
            change={change}
            id={`${instanceId}-change-${change.id}`}
            initialOpen={index === 0}
          />
        </OakFlex>
      ))}
    </OakFlex>
  );
};
