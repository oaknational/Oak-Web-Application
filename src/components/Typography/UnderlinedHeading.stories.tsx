import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { UnderlinedHeading as Component } from ".";

export default {
  title: "Typography/Heading - underlined",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args}>A heading with an underline</Component>
);

export const UnderlinedHeading = Template.bind({});
UnderlinedHeading.args = {
  tag: "h2",
  $font: "heading-6",
};
