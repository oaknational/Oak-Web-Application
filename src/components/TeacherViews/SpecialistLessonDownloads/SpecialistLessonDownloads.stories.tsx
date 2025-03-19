import type { Meta, StoryObj } from "@storybook/react";

import Component from "./SpecialistLessonDownloads.view";
import { downloads, nextLessons } from "./SpecialistLessonDownloads.fixture";

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
        expired: false,
        isSpecialist: true,
        isLegacy: true,
        lessonSlug: "healthy-hugs-1",
        lessonTitle: "Healthy hugs",
        programmeSlug: "creative-arts-l",
        subjectSlug: "specialist-and-therapies",
        subjectTitle: "Specialist and therapies",
        unitSlug: "Creative arts",
        unitTitle: "Creative arts",
        nextLessons: nextLessons,
        downloads: downloads,
        additionalFiles: [],
        updatedAt: "2021-09-29T14:00:00Z",
        geoRestricted: false,
        loginRequired: false,
      },
    },
  },
};
