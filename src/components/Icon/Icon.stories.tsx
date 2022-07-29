import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./Icon";

export default {
  title: "Media/Icon",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args}></Component>
);

export const Icon = Template.bind({});

Icon.args = {
  name: "Download",
  size: 80,
};
