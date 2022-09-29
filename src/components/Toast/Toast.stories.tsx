import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { ToastProvider } from "../../context/Toast";
import CopyLinkButton from "../Button/CopyLinkButton";

import Component from ".";

const shareData = {
  shareTitle: "Title of an article to share",
  shareText: "Some summary text",
};

export default {
  title: "Interactive/Toast",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = () => {
  return (
    <ToastProvider>
      <Component />
      <CopyLinkButton {...shareData} />
    </ToastProvider>
  );
};

export const Toast = Template.bind({});
