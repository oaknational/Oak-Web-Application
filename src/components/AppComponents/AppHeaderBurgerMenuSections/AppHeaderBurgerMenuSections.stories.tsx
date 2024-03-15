import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./AppHeaderBurgerMenuSections";

import { menuSections } from "@/browser-lib/fixtures/menuSections";

export default {
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const NewMenuLinks = Template.bind({});
NewMenuLinks.args = {
  menuSections: menuSections,
};
