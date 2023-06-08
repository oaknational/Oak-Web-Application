import type { Meta, StoryObj } from "@storybook/react";

import AnalyticsDecorator from "../../storybook-decorators/AnalyticsDecorator";
import { MenuProvider } from "../../context/Menu";

import Component from "./AppHeader";

const meta: Meta<typeof Component> = {
  title: "Headers & Footers/App Header",
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
