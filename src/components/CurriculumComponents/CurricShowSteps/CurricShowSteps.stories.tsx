import { Meta, StoryObj } from "@storybook/react";

import { CurricShowSteps as Component } from ".";

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ["autodocs"],
  argTypes: {
    numberOfSteps: {
      type: "number",
      control: {
        type: "range",
        min: 2,
        max: 5,
      },
    },
    currentStep: {
      type: "number",
      control: "number",
    },
  },
  parameters: {
    controls: {
      include: ["numberOfSteps", "currentStep"],
    },
  },
  render: (args) => <Component {...args} />,
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    currentStep: 2,
    numberOfSteps: 4,
  },
};
