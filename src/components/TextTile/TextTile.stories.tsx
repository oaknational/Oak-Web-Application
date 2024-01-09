import { Meta, StoryObj } from "@storybook/react";

import Component from "./TextTitle";

import { Span } from "@/components/SharedComponents/Typography";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {},
};
export default meta;
type Story = StoryObj<typeof Component>;

export const TextTile: Story = {
  args: {
    $background: "white",
  },
  render: (args) => (
    <Component {...args}>
      <Span>Content dropped in as children</Span>
    </Component>
  ),
};
