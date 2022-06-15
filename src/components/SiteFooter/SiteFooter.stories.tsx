import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./SiteFooter";

export default {
  title: "Headers & Footers/Site Footer",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const SiteFooter = Template.bind({});
SiteFooter.args = {};
