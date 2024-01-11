import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from ".";

export default {
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = () => (
  <Component
    linkTargetIds={{
      worksheet: "",
      exitQuiz: "",
      introQuiz: "",
      video: "",
    }}
  />
);

export const LessonPlanningElementLinks = Template.bind({});
