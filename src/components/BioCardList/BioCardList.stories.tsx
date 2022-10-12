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
    {
      id: "123",
      name: "Jack",
      role: "Worker",
    },
    {
      id: "123",
      name: "Joe",
      role: "Worker",
    },
    {
      id: "123",
      name: "Craig",
      role: "Worker",
    },
    {
      id: "123",
      name: "Verity",
      role: "Worker",
    },
    {
      id: "123",
      name: "Mitch",
      role: "Worker",
    },
    {
      id: "123",
      name: "Tomas",
      role: "Worker",
    },
    {
      id: "123",
      name: "Jim",
      role: "Worker",
    },
    {
      id: "123",
      name: "Ross",
      role: "Worker",
    },
    {
      id: "123",
      name: "Ian",
      role: "Worker",
    },
    {
      id: "123",
      name: "Matt",
      role: "Worker",
    },
  ],
};
