import { Meta } from "@storybook/nextjs";

import Component from ".";

export default {
  component: Component,
  argTypes: {
    title: { defaultValue: "Oak Nayional Academy" },
  },
} as Meta<typeof Component>;

export const Logo = {};
