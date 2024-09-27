import React from "react";
import { StoryFn, Meta } from "@storybook/react";

import Component from "./AppHeaderBurgerMenuLink";

export default {
  component: Component,
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => <Component {...args} />;

export const AppHeaderBurgerMenuLink = Template.bind({});
AppHeaderBurgerMenuLink.args = {
  link: {
    linkTo: { page: "home" },
    text: "Home",
    new: true,
    external: false,
  },
};
