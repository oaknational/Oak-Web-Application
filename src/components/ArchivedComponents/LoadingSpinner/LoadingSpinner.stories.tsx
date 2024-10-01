import React from "react";
import { StoryFn, Meta } from "@storybook/react";

import Component from "./LoadingSpinner";

export default {
  component: Component,
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => <Component {...args} />;

export const LoadingSpinner = Template.bind({});
