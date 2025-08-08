import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import {
  OakSmallPrimaryInvertedButton,
  OakFlex,
  OakSpan,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";

import { LessonOverviewCreateWithAiNav } from "../LessonOverviewCreateWithAINav/LessonOverviewCreateWithAiNav";

import { LessonOverviewDropdownNavButton } from "./LessonOverviewDropdownNavButton";

// Generic Dropdown Navigation Button Stories
const dropdownNavMeta: Meta<typeof LessonOverviewDropdownNavButton> = {
  component: LessonOverviewDropdownNavButton,
  tags: ["autodocs"],
  title: "components/TeacherComponents/LessonOverviewDropdownNavButton",
  parameters: {
    controls: {
      include: [
        "primaryActionText",
        "primaryActionIcon",
        "onPrimaryAction",
        "items",
        "footer",
        "isPrimaryActionLoading",
        "isPrimaryActionDisabled",
        "containerWidth",
        "ariaLabel",
        "ariaDescription",
      ],
    },
  },
  args: {
    primaryActionText: "Additional Materials",
    primaryActionIcon: "chevron-down",
    items: [
      { label: "Glossary" },
      { label: "Comprehension task" },
      { label: "Lesson narrative" },
      { label: "More starter quiz questions" },
      { label: "More exit quiz questions" },
    ],
    footer: (
      <OakFlex
        $flexDirection="column"
        $alignItems="center"
        $gap="space-between-xs"
      >
        <OakSpan $font="heading-light-7" $color="text-primary">
          Learn more about our materials
        </OakSpan>
        <OakSmallPrimaryInvertedButton element="a" href="#" iconName="external">
          Learn more
        </OakSmallPrimaryInvertedButton>
      </OakFlex>
    ),
    isPrimaryActionLoading: false,
    isPrimaryActionDisabled: false,
    ariaLabel: "Additional teaching materials",
    ariaDescription: "Access additional teaching resources and materials",
  },
  argTypes: {
    onPrimaryAction: {
      action: "Primary action clicked",
    },
  },
};

export default dropdownNavMeta;

type DropdownNavStory = StoryObj<typeof LessonOverviewDropdownNavButton>;

export const CustomTeacherResources: DropdownNavStory = {
  render: (args) => (
    <OakThemeProvider theme={oakDefaultTheme}>
      <LessonOverviewDropdownNavButton {...args} />
    </OakThemeProvider>
  ),
  args: {
    primaryActionText: "Create New Resource",
    primaryActionIcon: "edit",
    items: [
      { label: "Lesson Plans", iconName: "worksheet" },
      { label: "Assessment Tools", iconName: "quiz" },
      { label: "Student Worksheets", iconName: "worksheet-3" },
    ],
    footer: (
      <OakFlex
        $flexDirection="column"
        $alignItems="center"
        $gap="space-between-xs"
      >
        <OakSpan $font="heading-light-7" $color="text-primary">
          Need help with lesson planning?
        </OakSpan>
        <OakSmallPrimaryInvertedButton element="a" href="#" iconName="external">
          Get support
        </OakSmallPrimaryInvertedButton>
      </OakFlex>
    ),
    ariaLabel: "Teaching resources hub",
  },
};

// AI Nav Component Stories
export const CreateWithAi: StoryObj<typeof LessonOverviewCreateWithAiNav> = {
  render: (args) => (
    <OakThemeProvider theme={oakDefaultTheme}>
      <LessonOverviewCreateWithAiNav {...args} />
    </OakThemeProvider>
  ),
  args: {
    lessonSlug: "sample-lesson",
    programmeSlug: "sample-programme",
  },
  parameters: {
    docs: {
      description: {
        story:
          "The Create with AI navigation component with default lesson and programme slugs.",
      },
    },
  },
};
