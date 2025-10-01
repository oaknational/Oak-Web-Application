import { Meta } from "@storybook/nextjs";

import Component from "./LayoutFixedHeader";

export default {
  component: Component,
  argTypes: {
    children: {
      defaultValue: "Fixed Header",
    },
    background: { defaultValue: "grey40" },
  },
} as Meta<typeof Component>;

export const LayoutFixedHeader = {};
