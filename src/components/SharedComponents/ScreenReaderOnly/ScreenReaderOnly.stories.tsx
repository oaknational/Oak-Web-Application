import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./ScreenReaderOnly";

export default {
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args}>
    A screen reader will read this but you can't see it visually
  </Component>
);

export const ScreenReaderOnly = Template.bind({});

ScreenReaderOnly.args = {};
