import React from "react";
// import { ComponentStory, ComponentMeta } from "@storybook/react";
import type { Meta, StoryObj } from "@storybook/react";

import Component from "./TabImageButton";

const meta: Meta<typeof Component> = {
  title: "Buttons/TabImageButton",

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

export const TabImageButton: Story = {
  args: {
    imageSlug: "teacher-carrying-stuff",
    label: "Teaching Resources",
    isCurrent: true,
    isNew: true,
  },
  render: (args) => <Component {...args} />,
};
