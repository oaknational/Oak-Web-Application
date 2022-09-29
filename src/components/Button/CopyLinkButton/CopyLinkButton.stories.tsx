import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { ToastProvider } from "../../../context/Toast";

import Component from "./CopyLinkButton";

const shareData = {
  shareTitle: "Title of an article to share",
  shareText: "Some summary text",
};

export default {
  title: "Buttons/Copy Link",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <ToastProvider>
    <Component {...args} {...shareData} />
  </ToastProvider>
);

export const CopyLinkButton = Template.bind({});
