import { Meta } from "@storybook/nextjs";

import { LessonAppearsInPathwayCard as Component } from "./LessonAppearsInPathwayCard";

export default {
  component: Component,
  argTypes: {},
} as Meta<typeof Component>;

export const LessonAppearsInPathwayCard = {
  args: {
    unitSlug: "unit-slug",
    examBoardTitle: "AQA",
    examBoardSlug: "aqa",
    subjectTitle: "Maths",
    subjectSlug: "maths",
    tiers: [
      {
        programmeSlug: "programme-slug",
        tierTitle: "Foundation",
        tierSlug: "foundation",
      },
      {
        programmeSlug: "programme-slug",
        tierTitle: "Core",
        tierSlug: "core",
      },
      {
        programmeSlug: "programme-slug",
        tierTitle: "Higher",
        tierSlug: "higher",
      },
    ],
  },

  parameters: {
    backgrounds: {
      default: "dark",
    },
  },
};
