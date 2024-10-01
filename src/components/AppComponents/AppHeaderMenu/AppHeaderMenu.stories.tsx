import React from "react";
import { StoryFn, Meta } from "@storybook/react";

import Component from "./AppHeaderMenu";

import { MenuProvider } from "@/context/Menu";

export default {
  component: Component,
  argTypes: {
    children: {
      defaultValue: "Menu content",
    },
  },
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => (
  <MenuProvider>
    <Component {...args} />
  </MenuProvider>
);

export const Menu = Template.bind({});
