import type { Meta, StoryObj } from "@storybook/nextjs";

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
    <OakNotificationsProvider>
      <Component {...args} />
    </OakNotificationsProvider>
  ),
  args: {
    teachers,
    pupils,
  },
};

export const WithoutData: Story = {
  render: (args) => (
    <OakNotificationsProvider>
      <Component {...args} />
    </OakNotificationsProvider>
  ),
  args: {
    teachers: null,
    pupils: null,
  },
};
