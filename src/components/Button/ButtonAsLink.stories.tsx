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
      defaultValue: "primary",
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
