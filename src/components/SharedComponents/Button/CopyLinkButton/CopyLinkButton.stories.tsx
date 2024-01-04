import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { ToastProvider } from "../../../../context/Toast";

import Component from "./CopyLinkButton";

export default {
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <ToastProvider>
    <Component {...args} />
  </ToastProvider>
);

export const CopyLinkButton = Template.bind({});
