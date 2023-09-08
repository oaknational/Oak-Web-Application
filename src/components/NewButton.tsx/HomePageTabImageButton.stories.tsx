import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import Component from "./HomePageTabImageButton";

const meta: Meta<typeof Component> = {
  title: "Buttons/HomePageTabImageButton",

  component: Component,
  argTypes: {
    onClick: { action: "clicked" },
    label: {
      defaultValue: "Label",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Component>;

export const HomePageTabImageButton: Story = {
  args: {
    imageSlug: "teacher-carrying-stuff",
    label: "Teaching Resources",
    isCurrent: true,
    isNew: true,
  },
  render: (args) => <Component {...args} />,
};
