import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./Hr";
import Typography from "./Typography";

export default {
  title: "Typography/Hr",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Typography fontSize={18}>
    <p>See below</p>
    <Component {...args} />
    <p>For a horizontal rule</p>
  </Typography>
);

export const Hr = Template.bind({});
