import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from ".";

export default {
  title: "Element/Lesson Element Links",
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

export const LessonProgressionGraphic = Template.bind({});
