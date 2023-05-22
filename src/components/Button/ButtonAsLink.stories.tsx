import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./ButtonAsLink";

export default {
  title: "Buttons/Button As Link",
  component: Component,
  argTypes: {
    label: {
      defaultValue: "Click me",
    },
    variant: {
      defaultValue: "minimal",
    },
    href: {
      defaultValue: "/",
    },
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const ButtonAsLink = Template.bind({});
ButtonAsLink.args = {
  label: "Click me",
  variant: "minimal",
  href: "/",
};
