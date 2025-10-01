import React from "react";
import { StoryFn, Meta } from "@storybook/nextjs";
import { OakFlex } from "@oaknational/oak-components";

import Component from ".";

export default {
  component: Component,
  argTypes: {
    onClick: { action: "clicked" },
    "aria-label": {
      defaultValue: "Click me",
    },
    icon: {
      defaultValue: "download",
    },
    variant: {
      defaultValue: "brush",
    },
  },
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => (
  <OakFlex>
    <Component {...args} background="black" $mr={24} />
    <Component {...args} background="blue" $mr={24} />
    <Component {...args} background="oakGreen" />
  </OakFlex>
);

export const IconButton = {
  render: Template,
};
