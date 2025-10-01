import React from "react";
import { StoryFn, Meta } from "@storybook/nextjs";

import Component from ".";

export default {
  component: Component,
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => {
  return <Component {...args} />;
};

export const Svg = {
  render: Template,

  args: {
    name: "looping-arrow-1",
  },
};
