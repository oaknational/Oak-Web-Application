import type { Meta, StoryObj } from "@storybook/react";

import Component from ".";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {
    children: {
      defaultValue: "Flex box",
    },
    $pa: { defaultValue: [20, 40, 60] },
    $background: { defaultValue: "white" },
  },
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Flex: Story = {
  args: {
    children: "Flex box",
    $pa: [20, 40, 60],
    $background: "white",
  },
};
