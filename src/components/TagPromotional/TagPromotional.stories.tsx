import { Meta, StoryObj } from "@storybook/react";

import Component from ".";

import Flex from "@/components/SharedComponents/Flex";

const meta: Meta<typeof Component> = {
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
      <Flex $background={"grey30"} $pa={16}>
        <Component size={"small"} />
        <Component size={"medium"} />
        <Component size={"large"} />
      </Flex>
    );
  },
};
