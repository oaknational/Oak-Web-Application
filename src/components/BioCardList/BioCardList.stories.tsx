import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from ".";

export default {
  title: "Lists/BioCardList",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
  return <Component {...args} />;
};

export const BioCardList = Template.bind({});
BioCardList.args = {
  people: [
    "Jack",
    "Joe",
    "Craig",
    "Verity",
    "Mitch",
    "Tomas",
    "Jim",
    "Ross",
    "Ian",
    "Matt",
  ].map((name, i) => ({ name, id: String(i), role: "Worker" })),
};
