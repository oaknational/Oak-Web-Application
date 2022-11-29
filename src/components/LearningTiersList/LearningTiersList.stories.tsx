import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from ".";

export default {
  title: "Lists",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const LearningTiersList = Template.bind({});

LearningTiersList.args = {
  tiers: [
    { title: "Foundation", lessonCount: 23, unitCount: 4 },
    { title: "Core", lessonCount: 43, unitCount: 4 },
    { title: "Higher", lessonCount: 34, unitCount: 5 },
  ],
  background: "teachersPastelYellow",
};
