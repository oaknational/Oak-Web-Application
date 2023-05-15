import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from ".";

export default {
  title: "Lists/BioCardList/BioCardListItem",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
  return <Component {...args} />;
};

export const BioCardListItem = Template.bind({});
BioCardListItem.args = {
  name: "John Smith",
  role: "Worker",
};
