import type { Meta, StoryObj } from "@storybook/nextjs";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import Component from "./SearchBar";

const meta: Meta<typeof Component> = {
  component: Component,
};

export default meta;
type Story = StoryObj<typeof Component>;

export const SearchBar: Story = {
  render: () => (
    <OakThemeProvider theme={oakDefaultTheme}>
      <Component />
    </OakThemeProvider>
  ),
};
