import type { Meta, StoryObj } from "@storybook/react";

import Component from "./IconButtonAsLink";

const meta: Meta<typeof Component> = {
  title: "Buttons/Icon Button As Link",
  component: Component,
  argTypes: {
    "aria-label": {
      defaultValue: "Click me",
    },
    variant: {
      defaultValue: "brush",
    },
    icon: {
      defaultValue: "download",
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
    "aria-label": "Click me",
    variant: "brush",
    icon: "download",
    href: "/",
  },
};
