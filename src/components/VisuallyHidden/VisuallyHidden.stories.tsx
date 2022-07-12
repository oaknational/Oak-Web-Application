import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./VisuallyHidden";

export default {
  title: "Accessibility/Visually Hidden",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args}>
    A screen reader will read this but you can't see it
  </Component>
);

export const VisuallyHidden = Template.bind({});

VisuallyHidden.args = {};
