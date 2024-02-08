import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
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
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <OakFlex>
    <Component {...args} background="black" $mr={24} />
    <Component {...args} background="blue" $mr={24} />
    <Component {...args} background="oakGreen" />
  </OakFlex>
);

export const IconButton = Template.bind({});
