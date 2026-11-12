"use client";

import { useId } from "react";
import {
  OakFlex,
  OakHeading,
  OakImage,
  OakTertiaryButton,
} from "@oaknational/oak-components";

import { NationalCurriculumInsightsPortableText } from "../PortableText";

import { guidancePortableTextComponents, type SectionProps } from "./shared";

import { getCloudinaryImageUrl } from "@/utils/getCloudinaryImageUrl";
import { requestNationalCurriculumInsightsDownload } from "@/common-lib/urls/nationalCurriculumInsightsDownload";

export const NationalCurriculumInsightsChecklist = ({
  section,
  variant = "phase",
}: SectionProps<"NationalCurriculumInsightsChecklistSection"> & {
  variant?: "phase" | "keyStage";
}) => {
  const headingId = `${useId()}-${section.audience}-checklist-heading`;
  return (
    <OakFlex
      as="section"
      aria-labelledby={headingId}
      data-insights-module={`${section.audience}-checklist`}
      $flexDirection="column"
      $gap="spacing-16"
      $width="100%"
    >
      <OakFlex $flexDirection="column" $gap="spacing-24">
        <OakHeading id={headingId} tag="h2" $font="heading-4">
          {section.heading}
        </OakHeading>
        <OakFlex
          as="ul"
          $flexDirection="column"
          $gap="spacing-20"
          $ma="spacing-0"
          $pa="spacing-0"
        >
          {section.items.map((item) => (
            <OakFlex
              as="li"
              key={item.id}
              $gap="spacing-8"
              $alignItems="flex-start"
            >
              <OakFlex $flexShrink={0} $mt="spacing-4">
                <OakImage
                  src={getCloudinaryImageUrl(
                    variant === "keyStage"
                      ? "svg-illustrations/checklist-tick-key-stage.svg"
                      : "svg-illustrations/checklist-tick-phase.svg",
                  )}
                  alt=""
                  aria-hidden="true"
                  $width="spacing-20"
                  $height="spacing-20"
                />
              </OakFlex>
              <OakFlex
                $flexDirection="column"
                $gap="spacing-12"
                $minWidth="spacing-0"
              >
                <NationalCurriculumInsightsPortableText
                  value={item.contentPortableText}
                  components={guidancePortableTextComponents}
                />
              </OakFlex>
            </OakFlex>
          ))}
        </OakFlex>
      </OakFlex>
      <OakFlex>
        <OakTertiaryButton
          type="button"
          iconName="download"
          onClick={(event) =>
            requestNationalCurriculumInsightsDownload(event.currentTarget)
          }
        >
          Download this checklist
        </OakTertiaryButton>
      </OakFlex>
    </OakFlex>
  );
};
