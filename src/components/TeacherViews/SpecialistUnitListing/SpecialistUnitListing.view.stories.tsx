import type { Meta, StoryObj } from "@storybook/nextjs";

import Component from "./SpecialistUnitListing.view";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";
import MenuDecorator from "@/storybook-decorators/MenuDecorator";

const meta: Meta<typeof Component> = {
  decorators: [AnalyticsDecorator, MenuDecorator],
  component: Component,
};

export default meta;
type Story = StoryObj<typeof Component>;

export const SpecialistUnitListingPage: Story = {
  args: {
    curriculumData: {
      subjectTitle: "Communication and Language",
      subjectSlug: "communication-and-language",
      programmeSlug: "changes-and-transtions-123a",
      units: [
        [
          {
            slug: "changes-and-transitions-123a",
            title: "Changes and Transitions",
            nullTitle: "Changes and Transitions",
            programmeSlug: "changes-and-transtions-123a",
            unpublishedLessonCount: 0,

            subjectSlug: "communication-and-language",
            subjectTitle: "Communication and Language",
            themeSlug: "Secondary",
            themeTitle: "Secondary",
            expired: false,
            expiredLessonCount: 0,
            lessonCount: 14,
            unitStudyOrder: 1,
            developmentStageSlug: "applying-learning",
            developmentStageTitle: "Applying learning",
            learningThemes: [],
          },
        ],
        [
          {
            slug: "journeys-and-adventures-723b",
            title: "Journeys and adventures",
            unpublishedLessonCount: 0,

            nullTitle: "Changes and Transitions",
            programmeSlug: "changes-and-transtions-618b",
            subjectSlug: "communication-and-language",
            subjectTitle: "Communication and Language",
            themeSlug: "secondary",
            themeTitle: "Secondary",
            expired: false,
            expiredLessonCount: 0,
            lessonCount: 6,
            unitStudyOrder: 1,
            developmentStageSlug: "early-development",
            developmentStageTitle: "Early development",
            learningThemes: [],
          },
        ],
      ],
      developmentStageSlug: "early-development",
      developmentStage: [
        {
          slug: "early-development",
          title: "Early development",
          unitCount: 6,
          lessonCount: 13,
          programmeSlug: "changes-and-transtions-123a",
        },
        {
          slug: "applying-learning",
          title: "Applying Learning",
          unitCount: 10,
          lessonCount: 20,
          programmeSlug: "changes-and-transtions-123a",
        },
      ],
      learningThemes: [
        { themeSlug: "test-theme-primary", themeTitle: "Test Theme Primary" },
        {
          themeSlug: "test-theme-secondary",
          themeTitle: "Test Theme Secondary",
        },
      ],
    },
  },
};
