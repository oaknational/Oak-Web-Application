import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import { CurricNumberInput as Component } from ".";
import type { CurricNumberInputProps } from ".";

function InteractiveWrapper(args: CurricNumberInputProps) {
  const [value, setValue] = useState(args.value);
  return <Component {...args} value={value} onChange={setValue} />;
}

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "The label text displayed above the input",
    },
    value: {
      control: "number",
      description: "Current value of the input",
    },
    min: {
      control: "number",
      description: "Minimum allowed value (default: 5)",
    },
    max: {
      control: "number",
      description: "Maximum allowed value (default: 35)",
    },
  },
  parameters: {
    controls: {
      include: ["label", "value", "min", "max"],
    },
  },
  decorators: [
    (Story) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Story />
      </OakThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    label: "Number of lessons",
    id: "lessons-input",
    value: 30,
    min: 5,
    max: 35,
  },
};

export const MinValue: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    label: "Number of lessons",
    id: "lessons-input-min",
    value: 5,
    min: 5,
    max: 35,
  },
};

export const MaxValue: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    label: "Number of lessons",
    id: "lessons-input-max",
    value: 35,
    min: 5,
    max: 35,
  },
};

export const CustomRange: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    label: "Custom range",
    id: "lessons-input-custom",
    value: 15,
    min: 10,
    max: 20,
  },
};
