import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./BurgerMenuLink";

export default {
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const NewMenuLink = Template.bind({});
NewMenuLink.args = {
  link: {
    linkTo: { page: "home" },
    text: "Home",
    new: true,
    external: false,
  },
};
