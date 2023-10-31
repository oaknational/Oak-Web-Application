import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import Component from "./Layout";

const meta: Meta<typeof Component> = {
  title: "Download Components/Layout",
  component: Component,
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Checkbox: Story = {
  args: {},
  render: (args) => {
    return <Component {...args} />;
  },
};
