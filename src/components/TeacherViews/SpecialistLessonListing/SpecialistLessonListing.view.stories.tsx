import type { Meta, StoryObj } from "@storybook/react";

import Component from "./SpecialistLessonListing.view";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";
import MenuDecorator from "@/storybook-decorators/MenuDecorator";

const meta: Meta<typeof Component> = {
  decorators: [AnalyticsDecorator, MenuDecorator],
  component: Component,
};

export default meta;
type Story = StoryObj<typeof Component>;

export const SpecialistLessonListingPage: Story = {
  args: {
    curriculumData: {
      subjectTitle: "A new normal",
      subjectSlug: "a-new-normal-123a",
      programmeSlug: "early-development-123a",
      programmeTitle: "Early development",
      unitTitle: "Creative arts",
      unitSlug: "creative-arts",
      lessons: [
        {
          lessonSlug: "healthy-hugs-14dea-lesson-1",
          lessonTitle: "Healthy Hugs",
          subjectSlug: "a-new-normal-123a",
          subjectTitle: "A new normal",
          unitSlug: "creative-arts",
          programmeSlug: "early-development-123a",
          programmeTitle: "Early development",
          description:
            "By the end of the lesson, pupils will share a positive message using gestures.",
          expired: false,
          quizCount: 1,
          videoCount: 1,
          presentationCount: 1,
          worksheetCount: 2,
          hasCopyrightMaterial: false,
          orderInUnit: 1,
        },
        {
          lessonSlug: "glitter-germs-lesson-1",
          lessonTitle: "Glitter germs",
          subjectSlug: "a-new-normal-123a",
          subjectTitle: "A new normal",
          unitSlug: "creative-arts",
          programmeSlug: "early-development-123a",
          programmeTitle: "Early development",
          description: "By the end of this lesson, pupils will create a visual",
          expired: false,
          quizCount: 0,
          videoCount: 1,
          presentationCount: 0,
          worksheetCount: 2,
          hasCopyrightMaterial: false,
          orderInUnit: 1,
        },
        {
          lessonSlug: "games-apart-1",
          lessonTitle: "Games apart",
          subjectSlug: "a-new-normal-123a",
          subjectTitle: "A new normal",
          unitSlug: "creative-arts",
          programmeSlug: "early-development-123a",
          programmeTitle: "Early development",
          description:
            "By the end of the lesson, pupils will play some safe playground games",
          expired: false,
          quizCount: 0,
          videoCount: 1,
          presentationCount: 1,
          worksheetCount: 2,
          hasCopyrightMaterial: false,
          orderInUnit: 1,
        },
      ],
    },
  },
};
