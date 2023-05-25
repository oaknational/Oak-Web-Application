import type { Meta, StoryObj } from "@storybook/react";

import Component from "./CardLinkIcon";

const meta: Meta<typeof Component> = {
  title: "Cards/Card Link Icon",
  component: Component,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Component>;

export const CardLinkIcon: Story = {
  args: {
    title: "Title",
    href: "/",
    background: "teachersPastelYellow",
    titleTag: "h3",
  },
};
