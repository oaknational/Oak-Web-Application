import React from "react";
import { StoryFn, Meta } from "@storybook/nextjs";

import Component from "./ScreenReaderOnly";

export default {
  component: Component,
  argTypes: {},
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => (
  <Component {...args}>
    A screen reader will read this but you can't see it visually
  </Component>
);

export const ScreenReaderOnly = {
  render: Template,
  args: {},
};
