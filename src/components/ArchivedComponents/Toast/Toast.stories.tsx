import React from "react";
import { StoryFn, Meta } from "@storybook/react";

import Component from ".";

import { ToastProvider } from "@/context/Toast";
import PostHogDecorator from "@/storybook-decorators/PostHogDecorator";
import CopyLinkButton from "@/components/SharedComponents/Button/CopyLinkButton";

export default {
  decorators: [PostHogDecorator],
  component: Component,
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = () => {
  return (
    <ToastProvider>
      <Component />
      <CopyLinkButton />
    </ToastProvider>
  );
};

export const Toast = {
  render: Template,
};
