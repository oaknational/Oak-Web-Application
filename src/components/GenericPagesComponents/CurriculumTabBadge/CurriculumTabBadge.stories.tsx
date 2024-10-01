import { StoryFn, Meta } from "@storybook/react";

import Component from ".";

export default {
  component: Component,
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => {
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
