import { Meta, StoryObj } from "@storybook/nextjs";

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
    currentStepIndex: {
      type: "number",
      description: "Index of the current step (zero based)",
      control: "number",
    },
  },
  parameters: {
    controls: {
      include: ["numberOfSteps", "currentStepIndex"],
    },
  },
  render: (args) => <Component {...args} />,
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    currentStepIndex: 2,
    numberOfSteps: 4,
  },
};
