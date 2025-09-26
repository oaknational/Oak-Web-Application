import React from "react";
import { StoryFn, Meta } from "@storybook/nextjs";

import { Heading as Component } from ".";

export default {
  component: Component,
  argTypes: {
    tag: {
      defaultValue: "h1",
    },
  },
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => (
  <Component {...args}>Heading 1</Component>
);

export const Heading = {
  render: Template,

  args: {
    tag: "h1",
  },
};
