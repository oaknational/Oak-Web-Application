import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./Hr";
import Body from "./Body";

export default {
  title: "Typography/Hr",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Body fontSize={18}>
    <p>See below</p>
    <Component {...args} />
    <p>For a horizontal rule</p>
  </Body>
);

export const Hr = Template.bind({});
