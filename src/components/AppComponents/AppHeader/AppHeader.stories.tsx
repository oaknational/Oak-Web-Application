import type { Meta, StoryObj } from "@storybook/nextjs";

import Component from "./AppHeader";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";
import { MenuProvider } from "@/context/Menu";

const meta: Meta<typeof Component> = {
  decorators: [AnalyticsDecorator],
  component: Component,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Flex: Story = {
  args: {},
  render: (args) => (
    <MenuProvider>
      <Component {...args} />
    </MenuProvider>
  ),
};
