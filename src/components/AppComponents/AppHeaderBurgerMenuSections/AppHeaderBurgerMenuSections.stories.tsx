import { Meta } from "@storybook/nextjs";

import Component from "./AppHeaderBurgerMenuSections";

import { burgerMenuSections } from "@/browser-lib/fixtures/burgerMenuSections";

export default {
  component: Component,
} as Meta<typeof Component>;

export const NewMenuLinks = {
  args: {
    burgerMenuSections: burgerMenuSections,
  },
};
