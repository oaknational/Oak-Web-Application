import React from "react";
import { StoryFn, Meta } from "@storybook/react";

import { UnderlinedHeading as Component } from ".";

export default {
  component: Component,
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => (
  <Component {...args}>A heading with an underline</Component>
);

export const UnderlinedHeading = {
  render: Template,

  args: {
    tag: "h2",
    $font: "heading-6",
  },
};
