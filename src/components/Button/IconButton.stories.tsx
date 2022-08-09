import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./IconButton";

export default {
  title: "Buttons/Icon Button",
  component: Component,
  argTypes: {
    onClick: { action: "clicked" },
    "aria-label": {
      defaultValue: "Click me",
    },
    icon: {
      defaultValue: "Download",
    },
    variant: {
      defaultValue: "brush",
    },
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const IconButton = Template.bind({});
