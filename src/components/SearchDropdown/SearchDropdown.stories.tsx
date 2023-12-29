import { Meta, StoryObj } from "@storybook/react";

import Component from "./SearchDropdown";
import { unitListData } from "./SearchDropdown.fixture";

const meta: Meta<typeof Component> = {
  component: Component,

  argTypes: {
    dropdownTitle: {
      defaultValue: "Select exam board",
    },
    dropdownContent: {
      defaultValue: unitListData,
    },
  },
};

export default meta;

type Story = StoryObj<typeof Component>;

export const SearchDropdown: Story = {
  args: {
    dropdownTitle: "Select exam board",
    dropdownContent: unitListData,
  },
  render: (args) => <Component {...args} />,
};
