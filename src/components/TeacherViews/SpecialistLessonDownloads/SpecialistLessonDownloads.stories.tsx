import type { Meta, StoryObj } from "@storybook/react";

import Component from "./SpecialistLessonDownloads.view";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";
import MenuDecorator from "@/storybook-decorators/MenuDecorator";

const meta: Meta<typeof Component> = {
  decorators: [AnalyticsDecorator, MenuDecorator],
  component: Component,
};

export default meta;
type Story = StoryObj<typeof Component>;

export const SpecialistLessonDownloadsPage: Story = {
  args: {
    curriculumData: {
      lesson: {
        isLegacy: true,
        lessonSlug: "healthy-hugs-1",
        lessonTitle: "Healthy hugs",
        programmeSlug: "creative-arts-l",
        subjectSlug: "specialist-and-therapies",
        subjectTitle: "Specialist and therapies",
        unitSlug: "Creative arts",
        unitTitle: "Creative arts",
        tierSlug: null,
        tierTitle: null,
        examBoardSlug: null,
        examBoardTitle: null,
        nextLessons: [
          {
            lessonSlug: "were-part-of-the-same-pond-2",
            lessonTitle: "We're part of the same pond",
          },
          { lessonSlug: "glitter-gems-3", lessonTitle: "Glitter gems" },
          { lessonSlug: "games-apart-4", lessonTitle: "Games apart" },
        ],
        downloads: [
          {
            type: "worksheet-pdf",
            exists: true,
            label: "Worksheet",
            ext: "PDF",
          },
          {
            type: "presentation",
            exists: true,
            label: "Presentation",
            ext: "PPT",
          },
          {
            type: "exit-quiz-questions",
            exists: true,
            label: "Exit quiz questions",
            ext: "PDF",
          },
          {
            type: "exit-quiz-answers",
            exists: true,
            label: "Exit quiz answers",
            ext: "PDF",
          },
        ],
      },
    },
  },
};
