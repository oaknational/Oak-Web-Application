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
    activeImageSlug: "teacher-carrying-stuff-1023-black",
    passiveImageSlug: "teacher-carrying-stuff-1023-oakgrey4",
    label: "Teaching Resources",
    isCurrent: false,
    isNew: true,
  },
  render: (args) => <Component {...args} />,
};
