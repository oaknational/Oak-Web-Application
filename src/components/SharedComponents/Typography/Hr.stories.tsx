import React from "react";
import { StoryFn, Meta } from "@storybook/react";

import Component from "./Hr";
import Typography from "./Typography.deprecated";

export default {
  component: Component,
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => (
  <Typography $font={"body-1"}>
    <p>See below</p>
    <Component {...args} />
    <p>For a horizontal rule</p>
  </Typography>
);

export const Hr = Template.bind({});
