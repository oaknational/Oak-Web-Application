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
    { title: "Foundation", numberUnits: 3, numberLessons: 4 },
    { title: "Core", numberUnits: 3, numberLessons: 4 },
    { title: "Higher", numberUnits: 3, numberLessons: 4 },
  ],
  background: "teachersYellow",
};
