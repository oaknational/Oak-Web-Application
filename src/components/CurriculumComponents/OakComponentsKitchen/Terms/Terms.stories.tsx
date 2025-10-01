import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { Meta, StoryObj } from "@storybook/nextjs";

import Component from ".";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Terms: Story = {
  args: {},
  render: () => {
    return (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Component />
      </OakThemeProvider>
    );
  },
};
