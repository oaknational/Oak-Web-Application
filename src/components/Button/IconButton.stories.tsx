import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./IconButton";

import Flex from "@/components/SharedComponents/Flex";


export default {
  component: Component,
  argTypes: {
    onClick: { action: "clicked" },
    "aria-label": {
      defaultValue: "Click me",
    },
    icon: {
      defaultValue: "download",
    },
    variant: {
      defaultValue: "brush",
    },
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Flex>
    <Component {...args} background="black" $mr={24} />
    <Component {...args} background="blue" $mr={24} />
    <Component {...args} background="oakGreen" />
  </Flex>
);

export const IconButton = Template.bind({});
