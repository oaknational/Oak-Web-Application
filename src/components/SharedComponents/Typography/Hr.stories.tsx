import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./Hr";
import Typography from "./Typography";

export default {
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Typography $font={"body-1"}>
    <p>See below</p>
    <Component {...args} />
    <p>For a horizontal rule</p>
  </Typography>
);

export const Hr = Template.bind({});
