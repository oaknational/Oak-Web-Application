import { Meta } from "@storybook/nextjs";

import Component from "./AppHeaderBurgerMenuLink";

export default {
  component: Component,
} as Meta<typeof Component>;

export const AppHeaderBurgerMenuLink = {
  args: {
    link: {
      linkTo: { page: "home" },
      text: "Home",
      new: true,
      external: false,
    },
  },
};
