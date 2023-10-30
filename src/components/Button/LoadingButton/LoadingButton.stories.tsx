import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./LoadingButton";

export default {
  title: "Buttons/Loading",
  component: Component,
  args: {
    isLoading: false,
    text: "Download .zip",
    loadingText: "Downloading...",
    icon: "download",
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const Button = Template.bind({});
