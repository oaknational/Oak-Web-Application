import type { Meta, StoryObj } from "@storybook/react";

import Component from ".";

const meta: Meta<typeof Component> = {
  title: "Headers & Footers/Banner",
  component: Component,
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Flex: Story = {
  args: {},
  render: () => <Component />,
};
