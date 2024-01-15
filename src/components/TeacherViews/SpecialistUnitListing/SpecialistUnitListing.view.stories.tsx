import type { Meta, StoryObj } from "@storybook/react";

import Component from "./SpecialistUnitListing.view";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";

//👇 This default export determines wh pere your story goes in the story list
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
      programmeSlug: "changes-and-transtions-618b",
      units: [
        [
          {
            slug: "changes-and-transitions-618b",
            title: "Changes and Transitions",
            nullTitle: "Changes and Transitions",
            programmeSlug: "changes-and-transtions-618b",
            subjectSlug: "communication-and-language",
            subjectTitle: "Communication and Language",
            themeSlug: "primary",
            themeTitle: "Primary",
            expired: false,
            expiredLessonCount: 0,
            lessonCount: 9,
            unitStudyOrder: 1,
            developmentalStageSlug: "building-understanding",
            developmentalStageTitle: "Building Understanding",
            keyStageTitle: "Key stage 1",
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
            developmentalStageSlug: "building-understanding",
            developmentalStageTitle: "Building Understanding",
            keyStageTitle: "Key stage 1",
          },
        ],
      ],
      developmentalStageSlug: "building-understanding",
      developmentalStage: [
        {
          slug: "building-understanding",
          title: "Building Understanding",
          unitCount: 10,
          lessonCount: 20,
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
