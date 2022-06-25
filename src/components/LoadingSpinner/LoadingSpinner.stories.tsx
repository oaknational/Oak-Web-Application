import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./LoadingSpinner";

export default {
  title: "Feedback/Loading Spinner",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const LoadingSpinner = Template.bind({});
