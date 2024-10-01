import { StoryFn, Meta } from "@storybook/react";

import Component from ".";

export default {
  component: Component,
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => {
  return <Component {...args} />;
};

export const TextBadge = {
  render: Template,

  args: {
    text: "80%",
  },
};

export const IconBadge = {
  render: Template,

  args: {
    icon: "share",
  },
};
