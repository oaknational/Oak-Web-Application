import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Menu from "./Menu";

export default {
  title: "Navigation/Menu",
  component: Menu,
  argTypes: {},
} as ComponentMeta<typeof Menu>;

const Template: ComponentStory<typeof Menu> = () => (
  <Menu>
    <p>I'm in a menu</p>
  </Menu>
);

export const Checkbox = Template.bind({});
