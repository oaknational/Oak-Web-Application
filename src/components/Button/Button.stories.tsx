import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./Button";

export default {
  title: "Buttons/Button",
  component: Component,
  argTypes: {
    onClick: { action: "clicked" },
    label: {
      defaultValue: "Click me",
    },
    variant: {
      defaultValue: "brush",
    },
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const Button = Template.bind({});

export const ButtonWithIcon = Template.bind({});
ButtonWithIcon.args = {
  icon: "Star",
};
