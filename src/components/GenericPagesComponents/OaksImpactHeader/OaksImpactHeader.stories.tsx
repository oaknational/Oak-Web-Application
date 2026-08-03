import { Meta, StoryObj } from "@storybook/nextjs";

import { OaksImpactHeader as Component } from ".";

const meta = {
  component: Component,
  tags: ["autodocs"],
  title: "Components/GenericPagesComponents/OaksImpactHeader",
  argTypes: {},
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    videoDescription: "How Oak is making an impact in schools across England.",
    video: undefined,
    title: "Oak's impact",
    body: "How our world-class curriculum is making a difference in schools and trusts across the country.",
  },
  render: (args) => <Component {...args} />,
};
