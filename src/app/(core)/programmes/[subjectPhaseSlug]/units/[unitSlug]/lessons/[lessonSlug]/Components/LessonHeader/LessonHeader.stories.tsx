import React from "react";
import { StoryObj, Meta } from "@storybook/react";
import {
  OakBreadcrumbs,
  oakDefaultTheme,
  OakThemeProvider,
} from "@oaknational/oak-components";

import LessonHeader from "./LessonHeader";

import { getCloudinaryImageUrl } from "@/utils/getCloudinaryImageUrl";

const meta: Meta<typeof LessonHeader> = {
  component: LessonHeader,
  tags: ["autodocs"],
  parameters: {
    controls: {
      include: ["heading"],
    },
  },
  decorators: [
    (Story) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Story />
      </OakThemeProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof LessonHeader>;

export const Default: Story = {
  args: {
    heading: "Cells",
    backgroundColorLevel: 1,
    heroImage: getCloudinaryImageUrl(
      "v1768402219/subject-hero-illustrations/english-hero_rrxdjq.svg",
    ),
    headerSlot: (
      <OakBreadcrumbs
        breadcrumbs={[
          { text: "Level 1", href: "www.google.com" },
          { text: "Level 2" },
        ]}
      />
    ),
    currentLessonSlug: "lesson-2",
    programmeSlug: "art-primary-ks1",
    unitSlug: "unit-1",
    nextLesson: {
      lessonSlug: "lesson-3",
      lessonTitle: "Lesson 3",
      lessonIndex: 3,
    },
    prevLesson: {
      lessonSlug: "lesson-1",
      lessonTitle: "Lesson 1",
      lessonIndex: 1,
    },
  },
};
