import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import Component from "./CopyLinkButton";

import { ToastProvider } from "@/context/Toast";

export default {
  component: Component,
  decorators: [
    (Story) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Story />
      </OakThemeProvider>
    ),
  ],
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => (
  <ToastProvider>
    <Component {...args} />
  </ToastProvider>
);

export const CopyLinkButton = {
  render: Template,
};
