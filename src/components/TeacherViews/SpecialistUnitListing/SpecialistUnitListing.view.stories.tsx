import type { Meta, StoryObj } from "@storybook/react";

import Component from "./SpecialistUnitListing.view";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";

const meta: Meta<typeof Component> = {
  decorators: [AnalyticsDecorator],
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
            subjectSlug: "communication-and-language",
            subjectTitle: "Communication and Language",
            themeSlug: "Secondary",
            themeTitle: "Secondary",
            expired: false,
            expiredLessonCount: 0,
            lessonCount: 14,
            unitStudyOrder: 1,
            developmentalStageSlug: "applying-learning",
            developmentalStageTitle: "Applying learning",
          },
        ],
        [
          {
            slug: "journeys-and-adventures-723b",
            title: "Journeys and adventures",
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
            developmentalStageSlug: "early-development",
            developmentalStageTitle: "Early development",
          },
        ],
      ],
      developmentalStageSlug: "early-development",
      developmentalStage: [
        {
          slug: "early-development",
          title: "Early development",
          unitCount: 6,
          lessonCount: 13,
        },
        {
          slug: "applying-learning",
          title: "Applying Learning",
          unitCount: 10,
          lessonCount: 20,
        },
      ],
      themes: [
        { themeSlug: "test-theme-primary", themeTitle: "Test Theme Primary" },
        {
          themeSlug: "test-theme-secondary",
          themeTitle: "Test Theme Secondary",
        },
      ],
    },
  },
};
