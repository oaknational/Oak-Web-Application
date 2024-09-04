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
      <div style={{ display: "flex" }}>
        <FocusIndicatorComponent>
          <button
            style={{
              background: "none",
              border: "solid 1px black",
            }}
          >
            Test
          </button>
        </FocusIndicatorComponent>
      </div>
    </OakThemeProvider>
  );
};

export const FocusIndicator: Story = {
  render: TestComponent,
};
