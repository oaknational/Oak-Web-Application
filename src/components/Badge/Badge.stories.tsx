import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from ".";

export default {
  title: "Element/Badge",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
  return <Component {...args} />;
};

export const TextBadge = Template.bind({});
TextBadge.args = {
  text: "80%",
};
export const IconBadge = Template.bind({});
IconBadge.args = {
  icon: "share",
};
