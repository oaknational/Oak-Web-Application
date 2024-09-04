import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { Meta, StoryObj } from "@storybook/react";

import FocusIndicatorComponent from ".";

const meta: Meta<typeof FocusIndicatorComponent> = {
  component: FocusIndicatorComponent,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof FocusIndicatorComponent>;

const TestComponent = () => {
  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <FocusIndicatorComponent>
        <button>Test</button>
      </FocusIndicatorComponent>
    </OakThemeProvider>
  );
};

export const FocusIndicator: Story = {
  render: TestComponent,
};
