import React from "react";
import { StoryFn, Meta } from "@storybook/nextjs";

import Component from ".";

export default {
  component: Component,
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => (
  <Component {...args}>Outline heading</Component>
);

export const OutlineHeading = {
  render: Template,

  args: {
    tag: "h1",
    $fontSize: 32,
  },
};
