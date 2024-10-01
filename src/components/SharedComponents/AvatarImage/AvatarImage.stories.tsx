import React from "react";
import { StoryFn, Meta } from "@storybook/react";

import Component from ".";

export default {
  component: Component,
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => <Component {...args} />;

export const AvatarImage = Template.bind({});
AvatarImage.args = {};
