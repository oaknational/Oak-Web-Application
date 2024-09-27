import React from "react";
import { StoryFn, Meta } from "@storybook/react";

import Component, { OAK_SOCIALS } from "./SocialButtons";

export default {
  component: Component,
  argTypes: {},
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => <Component {...args} />;

export const SocialButtons = Template.bind({});
SocialButtons.args = {
  ...OAK_SOCIALS,
};
