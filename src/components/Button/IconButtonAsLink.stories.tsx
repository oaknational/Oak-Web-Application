import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./IconButtonAsLink";

export default {
  title: "Buttons/Icon Button As Link",
  component: Component,
  argTypes: {
    "aria-label": {
      defaultValue: "Click me",
    },
    variant: {
      defaultValue: "brush",
    },
    icon: {
      defaultValue: "Download",
    },
    href: {
      defaultValue: "/",
    },
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const IconButtonAsLink = Template.bind({});
