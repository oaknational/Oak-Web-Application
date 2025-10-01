import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";

import SizeMonitor, { SizeMonitorBounds } from ".";

const meta: Meta<typeof SizeMonitor> = {
  component: SizeMonitor,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof SizeMonitor>;

const TestComponent = () => {
  const [bbox, setBbox] = useState<SizeMonitorBounds | null>(null);

  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <SizeMonitor onChange={setBbox}>
        {bbox && (
          <div
            style={{
              height: "100vh",
              width: "100%",
              background: "red",
              padding: 12,
            }}
          >
            size={bbox.width}x{bbox.height}
          </div>
        )}
      </SizeMonitor>
    </OakThemeProvider>
  );
};

export const SimpleRadio: Story = {
  render: TestComponent,
};
