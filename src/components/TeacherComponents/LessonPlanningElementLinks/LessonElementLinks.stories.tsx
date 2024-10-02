import { StoryFn, Meta } from "@storybook/react";

import Component from ".";

export default {
  component: Component,
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = () => (
  <Component
    linkTargetIds={{
      worksheet: "",
      exitQuiz: "",
      introQuiz: "",
      video: "",
    }}
  />
);

export const LessonPlanningElementLinks = {
  render: Template,
};
