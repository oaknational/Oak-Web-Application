import { Meta, StoryObj } from "@storybook/react";

import Flex from "../Flex";

import Component from ".";

const meta: Meta<typeof Component> = {
  title: "Element/Tag promotional",
  component: Component,
  argTypes: {
    size: {
      control: { type: "select", options: ["small", "medium", "large"] },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Component>;

export const TagPromotional: Story = {
  render: () => {
    return (
      <Flex $background={"oakGrey2"} $pa={16}>
        <Component size={"small"} />
        <Component size={"medium"} />
        <Component size={"large"} />
      </Flex>
    );
  },
};
