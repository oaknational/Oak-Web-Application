import React from "react";
import {
  OakFlex,
  OakIcon,
  OakSmallPrimaryInvertedButton,
  OakSpan,
} from "@oaknational/oak-components";

import { LessonOverviewHeaderProps } from "../LessonOverviewHeader";
import { LessonOverviewDropdownNavButton } from "../LessonOverviewDropdownNavButton/LessonOverviewDropdownNavButton";

import { resolveOakHref } from "@/common-lib/urls";

export type LessonOverviewCreateWithAiNavProps = {
  lessonSlug: string;
  programmeSlug: string;
};

export const LessonOverviewCreateWithAiNav = ({
  lessonSlug,
  programmeSlug,
  trackCreateWithAiButtonClicked,
  trackTeachingMaterialsSelected,
}: LessonOverviewHeaderProps) => {
  return (
    <LessonOverviewDropdownNavButton
      primaryActionText={"Create more with AI"}
      onPrimaryAction={trackCreateWithAiButtonClicked}
      footer={
        <>
          <OakSmallPrimaryInvertedButton
            element="a"
            href="https://www.oaknationalacademy.com/ai"
            target="_blank"
          >
            <OakFlex $flexDirection={"column"}>
              <OakSpan>Learn more about Aila, Oak's AI </OakSpan>
              <OakFlex $alignItems={"center"}>
                <OakSpan>lesson assistant </OakSpan>
                <OakIcon iconHeight="all-spacing-6" iconName="external" />
              </OakFlex>
            </OakFlex>
          </OakSmallPrimaryInvertedButton>
        </>
      }
      leadingItemIcon="ai"
      isNew={true}
      items={[
        {
          label: "Glossary",
          onClick: () => trackTeachingMaterialsSelected("glossary"),
          href: resolveOakHref({
            page: "labs-teaching-materials",
            query: {
              lessonSlug,
              programmeSlug,
              docType: "additional-glossary",
            },
          }),
        },
        {
          label: "Comprehension task",
          onClick: () => trackTeachingMaterialsSelected("comprehension task"),
          href: resolveOakHref({
            page: "labs-teaching-materials",
            query: {
              lessonSlug,
              programmeSlug,
              docType: "additional-comprehension",
            },
          }),
        },
        {
          label: "Exit quiz",
          onClick: () => trackTeachingMaterialsSelected("exit quiz"),
          href: resolveOakHref({
            page: "labs-teaching-materials",
            query: {
              lessonSlug,
              programmeSlug,
              docType: "additional-exit-quiz",
            },
          }),
        },
        {
          label: "Starter quiz",
          onClick: () => trackTeachingMaterialsSelected("starter quiz"),
          href: resolveOakHref({
            page: "labs-teaching-materials",
            query: {
              lessonSlug,
              programmeSlug,
              docType: "additional-starter-quiz",
            },
          }),
        },
      ]}
    />
  );
};
