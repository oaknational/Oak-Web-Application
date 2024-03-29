import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./Button";

export default {
  component: Component,
  argTypes: {
    onClick: { action: "clicked" },
    label: {
      defaultValue: "download",
    },
    variant: {
      defaultValue: "brush",
    },
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <>
    <Component background="black" $mr={24} {...args} />
    <Component background="blue" $mr={24} {...args} />
    <Component background="oakGreen" $mr={24} {...args} />
  </>
);

export const Button = Template.bind({});

export const ButtonWithIcon = Template.bind({});
ButtonWithIcon.args = {
  icon: "save",
  size: "large",
};

const MinimalButtonWithIconTemplate: ComponentStory<typeof Component> = (
  args,
) => (
  <>
    <Component iconBackground="black" $mr={24} {...args} />
    <Component iconBackground="blue" $mr={24} {...args} />
    <Component iconBackground="oakGreen" $mr={24} {...args} />
  </>
);

export const MinimalButtonWithIcon = MinimalButtonWithIconTemplate.bind({});
MinimalButtonWithIcon.args = {
  variant: "minimal",
  icon: "save",
  size: "large",
};
