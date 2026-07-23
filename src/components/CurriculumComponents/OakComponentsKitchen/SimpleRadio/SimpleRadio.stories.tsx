import { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";

import { RadioGroup, RadioButton } from ".";

const meta: Meta<typeof RadioGroup> = {
  component: RadioGroup,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

const TestComponent = () => {
  const [state, setState] = useState("");

  return (
    <RadioGroup
      name="test"
      onChange={(e) => setState(e.target.value)}
      value={state}
    >
      {["one", "two", "three"].map((value) => {
        return (
          <RadioButton key={value} value={value}>
            {value.toUpperCase()}
          </RadioButton>
        );
      })}
    </RadioGroup>
  );
};

export const SimpleRadio: Story = {
  render: TestComponent,
};
