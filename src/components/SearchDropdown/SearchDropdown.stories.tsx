import { Meta, StoryObj } from "@storybook/react";

import Component from "./SearchDropdown";
import { unitListData } from "./SearchDropdown.fixture";

const meta: Meta<typeof Component> = {
  component: Component,
  title: "Foundations/SearchDropdown",
  argTypes: {
    label: {
      defaultValue: "Select exam board",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Component>;

export const SearchDropdown: Story = {
  args: {
    label: "Select exam board",
    ...unitListData,
  },
  render: (args) => <Component {...args} />,
};
