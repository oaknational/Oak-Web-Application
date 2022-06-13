import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Heading as Component } from "./Typography";

export default {
  title: "Foundations/Heading",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args}>Heading</Component>
);

export const Heading = Template.bind({});
Heading.args = {
  tag: "h1",
};
