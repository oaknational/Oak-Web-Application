import { Meta } from "@storybook/nextjs";

import Component from "./LessonResourceGraphics";

export default {
  component: Component,
} as Meta<typeof Component>;

export const LessonResourceGraphic = {
  args: {
    items: [
      {
        titleSingular: "Slide deck",
        titlePlural: "Slide decks",
        icon: "slide-deck",
        resourceCount: 1,
      },
      {
        titleSingular: "Worksheet",
        titlePlural: "Worksheets",
        icon: "worksheet",
        resourceCount: 2,
      },
      {
        titleSingular: "Quiz",
        titlePlural: "Quizzes",
        icon: "quiz",
        resourceCount: 3,
      },
      {
        titleSingular: "Video",
        titlePlural: "Videos",
        icon: "video",
        resourceCount: 2,
      },
    ],
  },
};

export const LessonResourceGraphicMissing = {
  args: {
    items: [
      {
        titleSingular: "Slide deck",
        titlePlural: "Slide decks",
        icon: "slide-deck",
        resourceCount: 1,
      },

      {
        titleSingular: "Quiz",
        titlePlural: "Quizzes",
        icon: "quiz",
        resourceCount: 2,
      },
    ],
  },
};
