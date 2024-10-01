import React from "react";
import { StoryFn, Meta } from "@storybook/react";

import Component from "./CopyLinkButton";

import { ToastProvider } from "@/context/Toast";

export default {
  component: Component,
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => (
  <ToastProvider>
    <Component {...args} />
  </ToastProvider>
);

export const CopyLinkButton = Template.bind({});
