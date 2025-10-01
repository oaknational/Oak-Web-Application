import React from "react";
import { Meta, StoryObj } from "@storybook/nextjs";

import Component from "./LoadingButton";

const meta: Meta<typeof Component> = {
  component: Component,
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Layout: Story = {
  args: {
    isLoading: false,
    text: "Download .zip",
    loadingText: "Downloading...",
    icon: "download",
    disabled: false,
    success: false,
    type: "button",
  },
  render: (args) => {
    return <Component {...args} />;
  },
};
