import { Meta, StoryObj } from "@storybook/react";

import { Span } from "../Typography";

import Component from "./TextTitle";

const meta: Meta<typeof Component> = {
  title: "Cards/Text Tile",
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
