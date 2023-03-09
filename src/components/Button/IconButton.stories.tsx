import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Flex from "../Flex";

import Component from "./IconButton";

export default {
  title: "Buttons/Icon Button",
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
    <Component {...args} background="teachersHighlight" $mr={24} />
    <Component {...args} background="pupilsHighlight" />
  </Flex>
);

export const IconButton = Template.bind({});
