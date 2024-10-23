import { Meta } from "@storybook/react";

import Component from ".";

export default {
  component: Component,
  argTypes: {
    children: {
      defaultValue: "ImageBox",
    },
    background: {
      defaultValue: "grey40",
    },
    minWidth: {
      defaultValue: "50%",
    },
    minHeight: {
      defaultValue: 80,
    },
  },
} as Meta<typeof Component>;

export const Box = {};
