import React from "react";
import { StoryFn, Meta } from "@storybook/react";

import { LessonPathwayCard as Component } from "./LessonPathwayCard";

export default {
  title: "Lesson/Lesson Pathway Card",
  component: Component,
  argTypes: {},
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => <Component {...args} />;

export const LessonPathwayCard = Template.bind({});
LessonPathwayCard.args = {
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
};
LessonPathwayCard.parameters = {
  backgrounds: {
    default: "dark",
  },
};
