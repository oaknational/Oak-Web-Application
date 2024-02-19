import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from ".";

export default {
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args}>Outline heading</Component>
);

export const OutlineHeading = Template.bind({});
OutlineHeading.args = {
  tag: "h1",
  $fontSize: 32,
};
