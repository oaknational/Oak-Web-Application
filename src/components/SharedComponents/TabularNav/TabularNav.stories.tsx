import { Meta } from "@storybook/nextjs";

import Component from "./TabularNav";

export default {
  component: Component,
  argTypes: {},
} as Meta<typeof Component>;

export const TabularNav = {
  args: {
    label: "test label",
    links: [
      {
        label: "Foundation",
        page: null,
        href: "https://www.example.com",
      },
      {
        label: "Higher",
        page: null,
        href: "https://www.example.com",
      },
    ],
  },
};
