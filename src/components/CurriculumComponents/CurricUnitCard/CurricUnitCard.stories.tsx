import { Meta, StoryObj } from "@storybook/nextjs";

import Component from "./CurricUnitCard";
import { unitWithOptions } from "./CurricUnitCard.fixtures";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Component>;

export const CurricUnitCard: Story = {
  args: {
    unit: unitWithOptions,
    index: 10,
    isHighlighted: false,
    href: "#",
  },
  render: function Render(args) {
    return <Component {...args} />;
  },
};

export const CurricUnitCardHighlighted: Story = {
  args: {
    unit: unitWithOptions,
    index: 10,
    isHighlighted: true,
    href: "#",
  },
  render: function Render(args) {
    return <Component {...args} />;
  },
};
