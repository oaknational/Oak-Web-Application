import type { Meta, StoryObj } from "@storybook/nextjs";

import Component from "./CardLinkIcon";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Component>;

export const CardLinkIcon: Story = {
  args: {
    title: "Title",
    href: "/",
    background: "lemon50",
    titleTag: "h3",
  },
};
