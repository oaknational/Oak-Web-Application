import type { Meta, StoryObj } from "@storybook/react";

import Component from "./ComingSoonListItem";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {
    index: { defaultValue: 0 },
  },
};

export default meta;

type Story = StoryObj<typeof Component>;

export const ComingSoonListItem: Story = {
  args: {
    index: 0,
  },
  render: (args) => {
    return <Component {...args} />;
  },
};
