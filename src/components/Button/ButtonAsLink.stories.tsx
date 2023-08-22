import type { Meta, StoryObj } from "@storybook/react";

import Component from "./ButtonAsLink";

const meta: Meta<typeof Component> = {
  title: "Buttons/Button As Link",
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
