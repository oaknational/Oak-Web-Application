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
      name: "Jack S",
      role: "Underling",
    },
    {
      name: "Joe B",
      role: "Underling",
    },
    {
      name: "Craig M",
      role: "Underling",
    },
    {
      name: "Verity R",
      role: "Underling",
    },
    {
      name: "Mitch L",
      role: "Underling",
    },
    {
      name: "Tomas L",
      role: "Underling",
    },
    {
      name: "Jim C",
      role: "Underling",
    },
    {
      name: "Ross M",
      role: "Underling",
    },
    {
      name: "Ian",
      role: "Underling",
    },
    {
      name: "Matt G",
      role: "Underling",
    },
  ],
};
