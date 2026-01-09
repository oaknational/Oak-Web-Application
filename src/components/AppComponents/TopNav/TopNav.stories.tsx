import type { Meta, StoryObj } from "@storybook/nextjs";

import Component from "./TopNav";

import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";

const meta: Meta<typeof Component> = {
  component: Component,
};

export default meta;
type Story = StoryObj<typeof Component>;

const { teachers, pupils } = topNavFixture;

export const TopNav: Story = {
  render: (args) => (
    <OakThemeProvider theme={oakDefaultTheme}>
      <Component {...args} />
    </OakThemeProvider>
  ),
  args: {
    teachers,
    pupils,
  },
};
