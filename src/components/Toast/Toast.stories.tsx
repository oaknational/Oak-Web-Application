import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { ToastProvider } from "../../context/Toast";
import PostHogDecorator from "../../storybook-decorators/PostHogDecorator";

import Component from ".";

import CopyLinkButton from "@/components/SharedComponents/Button/CopyLinkButton";

export default {
  decorators: [PostHogDecorator],
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = () => {
  return (
    <ToastProvider>
      <Component />
      <CopyLinkButton />
    </ToastProvider>
  );
};

export const Toast = Template.bind({});
