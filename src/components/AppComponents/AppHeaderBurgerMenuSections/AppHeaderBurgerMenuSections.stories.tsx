import React from "react";
import { StoryFn, Meta } from "@storybook/react";

import Component from "./AppHeaderBurgerMenuSections";

import { burgerMenuSections } from "@/browser-lib/fixtures/burgerMenuSections";

export default {
  component: Component,
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => <Component {...args} />;

export const NewMenuLinks = Template.bind({});
NewMenuLinks.args = {
  burgerMenuSections: burgerMenuSections,
};
