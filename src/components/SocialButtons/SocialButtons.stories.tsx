import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component, { OAK_SOCIALS } from "./SocialButtons";

export default {
  title: "Buttons/Social Buttons",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const SocialButtons = Template.bind({});
SocialButtons.args = {
  ...OAK_SOCIALS,
};
