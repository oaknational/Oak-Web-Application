import { Meta } from "@storybook/nextjs";

import Component from "./GenericSummaryCardNavButton";

export default {
  component: Component,
  argTypes: {},
} as Meta<typeof Component>;

export const GenericSummaryCardNavButton = {
  args: {
    buttons: [
      { label: "Who we are", href: "/first-one" },
      { label: "Board", href: "/second-one" },
      { label: "Leadership", href: "/third-one" },
    ],
  },
};
