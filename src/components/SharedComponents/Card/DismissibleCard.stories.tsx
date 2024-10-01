import { Meta } from "@storybook/react";

import Component from "./DismissibleCard";

export default {
  component: Component,
  argTypes: {
    children: {
      defaultValue: "Close to remove",
    },
  },
  parameters: {
    backgrounds: {
      default: "dark",
    },
  },
} as Meta<typeof Component>;

export const DismissibleCard = {};
