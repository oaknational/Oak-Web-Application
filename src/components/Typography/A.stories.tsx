import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./A";

export default {
  title: "Typography/A",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args}>Click me!.</Component>
);

export const A = Template.bind({});
A.args = {
  fontWeight: 600,
  color: "inYourFace",
  href: "/jkj",
};
