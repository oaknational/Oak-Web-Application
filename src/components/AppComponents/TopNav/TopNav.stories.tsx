import type { Meta, StoryObj } from "@storybook/nextjs";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import Component from "./TopNav";

const meta: Meta<typeof Component> = {
  component: Component,
};

export default meta;
type Story = StoryObj<typeof Component>;

export const TopNav: Story = {
  render: () => (
    <OakThemeProvider theme={oakDefaultTheme}>
      <Component />
    </OakThemeProvider>
  ),
};
