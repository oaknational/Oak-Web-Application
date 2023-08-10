import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "@/components/LessonHelper/LessonHelper";

export default {
  title: "Element/Lesson Helper ",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const LessonHelper = Template.bind({});

LessonHelper.args = {
  supervisionLevel: "this is the helper description",
  equipment: [{ equipment: "this is the equipment description" }],
  contentGuidance: [
    {
      contentGuidanceLabel: "test label",
      contentGuidanceArea: "test area",
      contentGuidanceDescription: "test details",
    },
  ],
};
