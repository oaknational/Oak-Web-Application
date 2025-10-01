import { Meta } from "@storybook/nextjs";

import Component from ".";

export default {
  component: Component,
  argTypes: {
    children: {
      defaultValue: "Box",
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
