import type { Meta, StoryObj } from "@storybook/nextjs";

import Component from ".";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {
    label: {
      defaultValue: "Click me",
    },
    variant: {
      defaultValue: "brushNav",
    },
    href: {
      defaultValue: "/",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Component>;

export const ButtonAsLink: Story = {
  args: {
    label: "Click me",
    variant: "brushNav",
    href: "/",
  },
};
