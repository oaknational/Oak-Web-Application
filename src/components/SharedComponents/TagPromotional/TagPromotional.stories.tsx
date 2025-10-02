import { Meta, StoryObj } from "@storybook/nextjs";
import { OakFlex } from "@oaknational/oak-components";

import Component from ".";

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
      <OakFlex $background={"grey30"} $pa="inner-padding-m">
        <Component size={"small"} />
        <Component size={"medium"} />
        <Component size={"large"} />
      </OakFlex>
    );
  },
};
