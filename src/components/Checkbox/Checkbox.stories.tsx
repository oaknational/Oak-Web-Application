import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from ".";

export default {
  title: "Form/Checkbox",
  component: Component,
  argTypes: {
    labelText: {
      defaultValue: "Click me",
    },
    id: {
      defaultValue: "Click me",
    },
    checked: {
      defaultValue: true,
    },
    onChange: {
      action: "clicked",
    },
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
  return <Component {...args} />;
};

export const Checkbox = Template.bind({});
