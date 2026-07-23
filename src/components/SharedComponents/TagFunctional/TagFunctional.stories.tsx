import { Meta, StoryObj } from "@storybook/nextjs";

import { TagFunctional as Component } from "./TagFunctional";

const meta = {
  component: Component,
} satisfies Meta<typeof Component>;

export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    text: "AQA",
    color: "mint",
  },
  render: (args) => <Component {...args} />,
};
