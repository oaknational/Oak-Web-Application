import type { Meta, StoryObj } from "@storybook/react";

import { PromoSpan } from "./PromoSpan";

const meta: Meta<typeof PromoSpan> = {
  component: PromoSpan,
  argTypes: {
    children: {
      control: { type: "text" },
      defaultValue: "Myths",
    },
  },
};

export default meta;
type Story = StoryObj<typeof PromoSpan>;

export const Default: Story = {
  args: { children: "Myths" },
  render: (args) => <PromoSpan {...args} />,
};
