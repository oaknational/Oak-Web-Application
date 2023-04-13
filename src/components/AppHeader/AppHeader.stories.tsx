import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./AppHeader";

export default {
  title: "Headers & Footers/App Header",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const AppHeader = Template.bind({});
AppHeader.args = {};
