import type { Meta, StoryObj } from "@storybook/react";

import Component from ".";

const meta: Meta<typeof Component> = {
  title: "Foundations/Flex",
  component: Component,
  argTypes: {
    children: {
      defaultValue: "Flex box",
    },
    pa: { defaultValue: [20, 50, 100] },
    bg: { defaultValue: "calmAndWarm" },
  },
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Flex: Story = {
  args: {
    children: "Flex box",
    pa: [20, 50, 100],
    bg: "calmAndWarm",
  },
};
