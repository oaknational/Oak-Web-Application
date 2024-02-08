import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Heading as Component } from ".";

export default {
  component: Component,
  argTypes: {
    tag: {
      defaultValue: "h1",
    },
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args}>Heading 1</Component>
);

export const Heading = Template.bind({});
Heading.args = {
  tag: "h1",
};
