import React from "react";
import {
  OakFlex,
  OakIcon,
  OakSmallPrimaryInvertedButton,
  OakSpan,
  OakSmallSecondaryButtonWithDropdown,
} from "@oaknational/oak-components";

import { LessonOverviewHeaderProps } from "../LessonOverviewHeader";

import { resolveOakHref } from "@/common-lib/urls";
import { TeachingMaterialTypeValueType } from "@/browser-lib/avo/Avo";

const teachingMaterials: Array<{
  docType: string;
  label: string;
  ariaLabel: string;
  trackingName: TeachingMaterialTypeValueType;
}> = [
  {
    docType: "additional-glossary",
    label: "Glossary",
    ariaLabel: "Glossary",
    trackingName: "glossary",
  },
  {
    docType: "additional-comprehension",
    label: "Comprehension task",
    ariaLabel: "Comprehension task",
    trackingName: "comprehension task",
  },
  {
    docType: "additional-starter-quiz",
    label: "More starter quiz questions",
    ariaLabel: "More starter quiz questions",
    trackingName: "starter quiz",
  },
  {
    docType: "additional-exit-quiz",
    label: "More exit quiz questions",
    ariaLabel: "More exit quiz questions",
    trackingName: "exit quiz",
  },
];

export const LessonOverviewCreateWithAiDropdown = ({
  lessonSlug,
  programmeSlug,
  trackCreateWithAiButtonClicked,
  trackTeachingMaterialsSelected,
}: LessonOverviewHeaderProps) => {
  return (
    <OakSmallSecondaryButtonWithDropdown
      primaryActionText="Create more with AI"
      onPrimaryAction={trackCreateWithAiButtonClicked}
      leadingButtonIcon={
        <OakFlex
          $borderRadius={"border-radius-s"}
          $ph={"inner-padding-ssx"}
          $mr={"space-between-ssx"}
          $background={"lemon"}
          $alignItems={"center"}
          $justifyContent={"center"}
          $pr={"inner-padding-ssx"}
        >
          <OakIcon
            $height={"all-spacing-4"}
            $width={"all-spacing-4"}
            iconName={"ai"}
          />
          <OakSpan $font="body-3">{"New"}</OakSpan>
        </OakFlex>
      }
    >
      {teachingMaterials.map((material) => (
        <OakSmallSecondaryButtonWithDropdown.Item
          key={material.docType}
          iconName="external"
          aria-label={material.ariaLabel}
          element="a"
          target="_blank"
          href={resolveOakHref({
            page: "labs-teaching-materials",
            query: {
              lessonSlug,
              programmeSlug,
              docType: material.docType,
            },
          })}
          onClick={() =>
            trackTeachingMaterialsSelected &&
            trackTeachingMaterialsSelected(material.trackingName)
          }
        >
          {material.label}
        </OakSmallSecondaryButtonWithDropdown.Item>
      ))}

      <OakSmallSecondaryButtonWithDropdown.Divider />

      <OakSmallPrimaryInvertedButton
        element="a"
        href="https://www.oaknationalacademy.com/ai"
        target="_blank"
        $whiteSpace={"normal"}
      >
        <OakFlex $font={"body-3"} $flexDirection={"column"}>
          <OakSpan>Learn more about Aila, Oak's AI </OakSpan>
          <OakFlex $font={"body-3"} $alignItems={"center"}>
            <OakSpan>lesson assistant </OakSpan>
            <OakIcon iconHeight="all-spacing-6" iconName="external" />
          </OakFlex>
        </OakFlex>
      </OakSmallPrimaryInvertedButton>
    </OakSmallSecondaryButtonWithDropdown>
  );
};
