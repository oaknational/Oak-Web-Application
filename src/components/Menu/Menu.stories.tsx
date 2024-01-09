import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { MenuProvider } from "../../context/Menu";

import Component from "./Menu";

export default {
  component: Component,
  argTypes: {
    children: {
      defaultValue: "Menu content",
    },
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <MenuProvider>
    <Component {...args} />
  </MenuProvider>
);

export const Menu = Template.bind({});
