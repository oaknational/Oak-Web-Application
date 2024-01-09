import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./CopyLinkButton";

import { ToastProvider } from "@/context/Toast";

export default {
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <ToastProvider>
    <Component {...args} />
  </ToastProvider>
);

export const CopyLinkButton = Template.bind({});
