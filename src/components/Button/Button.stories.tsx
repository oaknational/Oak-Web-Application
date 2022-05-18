import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./Button";

export default {
  title: "Components/Buttons/Button",
  component: Component,
  argTypes: {
    onClick: { action: "clicked" },
    label: {
      defaultValue: "Click me",
    },
    variant: {
      defaultValue: "primary",
    },
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const Button = Template.bind({});
