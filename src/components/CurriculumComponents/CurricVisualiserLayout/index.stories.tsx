import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { Meta, StoryObj } from "@storybook/react";

import { CurricVisualiserLayout as Component } from ".";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Component>;

export const CurricVisualiserLayout: Story = {
  args: {
    filters: (
      <div style={{ background: "#ffcdd2", flex: 1 }}>filters section</div>
    ),
    units: <div style={{ background: "#bbdefb", flex: 1 }}>units section</div>,
  },
  render: function Render(args) {
    return (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Component {...args} />
      </OakThemeProvider>
    );
  },
};
