import type { Meta, StoryObj } from "@storybook/nextjs";

import Component from ".";

const meta: Meta<typeof Component> = {
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
