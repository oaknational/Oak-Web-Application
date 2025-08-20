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

export const LessonOverviewCreateWithAiNav = ({
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
      <OakSmallSecondaryButtonWithDropdown.Item
        iconName="external"
        aria-label="Glossary"
        element="a"
        target="_blank"
        href={resolveOakHref({
          page: "labs-teaching-materials",
          query: {
            lessonSlug,
            programmeSlug,
            docType: "additional-glossary",
          },
        })}
        onClick={() =>
          trackTeachingMaterialsSelected &&
          trackTeachingMaterialsSelected("glossary")
        }
      >
        Glossary
      </OakSmallSecondaryButtonWithDropdown.Item>
      <OakSmallSecondaryButtonWithDropdown.Item
        iconName="external"
        aria-label="Comprehension task"
        element="a"
        target="_blank"
        href={resolveOakHref({
          page: "labs-teaching-materials",
          query: {
            lessonSlug,
            programmeSlug,
            docType: "additional-comprehension",
          },
        })}
        onClick={() =>
          trackTeachingMaterialsSelected &&
          trackTeachingMaterialsSelected("comprehension task")
        }
      >
        Comprehension task
      </OakSmallSecondaryButtonWithDropdown.Item>
      <OakSmallSecondaryButtonWithDropdown.Item
        iconName="external"
        element="a"
        target="_blank"
        aria-label="More starter quiz questions"
        href={resolveOakHref({
          page: "labs-teaching-materials",
          query: {
            lessonSlug,
            programmeSlug,
            docType: "additional-starter-quiz",
          },
        })}
        onClick={() =>
          trackTeachingMaterialsSelected &&
          trackTeachingMaterialsSelected("starter quiz")
        }
      >
        More starter quiz questions
      </OakSmallSecondaryButtonWithDropdown.Item>
      <OakSmallSecondaryButtonWithDropdown.Item
        iconName="external"
        element="a"
        target="_blank"
        aria-label="More exit quiz questions"
        href={resolveOakHref({
          page: "labs-teaching-materials",
          query: {
            lessonSlug,
            programmeSlug,
            docType: "additional-exit-quiz",
          },
        })}
        onClick={() =>
          trackTeachingMaterialsSelected &&
          trackTeachingMaterialsSelected("exit quiz")
        }
      >
        More exit quiz questions
      </OakSmallSecondaryButtonWithDropdown.Item>

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
