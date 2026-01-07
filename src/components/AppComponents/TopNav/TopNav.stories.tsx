import type { Meta, StoryObj } from "@storybook/nextjs";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import Component from "./TopNav";

import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";
import { OakNotificationsProvider } from "@/context/OakNotifications/OakNotificationsProvider";

const meta: Meta<typeof Component> = {
  component: Component,
};

export default meta;
type Story = StoryObj<typeof Component>;

const { teachers, pupils } = topNavFixture;

export const TopNav: Story = {
  render: (args) => (
    <OakThemeProvider theme={oakDefaultTheme}>
      <OakNotificationsProvider>
        <Component {...args} />
      </OakNotificationsProvider>
    </OakThemeProvider>
  ),
  args: {
    teachers,
    pupils,
  },
};

export const WithoutData: Story = {
  render: (args) => (
    <OakThemeProvider theme={oakDefaultTheme}>
      <OakNotificationsProvider>
        <Component {...args} />
      </OakNotificationsProvider>
    </OakThemeProvider>
  ),
  args: {
    teachers: null,
    pupils: null,
  },
};
