import React from "react";
import { StoryFn, Meta } from "@storybook/react";

import { LessonAppearsInPathwayCard as Component } from "./LessonAppearsInPathwayCard";

export default {
  component: Component,
  argTypes: {},
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => <Component {...args} />;

export const LessonAppearsInPathwayCard = Template.bind({});
LessonAppearsInPathwayCard.args = {
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
LessonAppearsInPathwayCard.parameters = {
  backgrounds: {
    default: "dark",
  },
};
