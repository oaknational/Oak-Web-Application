import { StoryFn, Meta } from "@storybook/react";

import Component from ".";

export default {
  component: Component,
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => {
  return <Component {...args} />;
};

export const BioCardListItem = Template.bind({});
BioCardListItem.args = {
  name: "John Smith",
  role: "Worker",
};
