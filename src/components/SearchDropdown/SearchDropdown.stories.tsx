import { Meta, StoryObj } from "@storybook/react";

import Component from "./SearchDropdown";

import { searchResultsItem } from "@/node-lib/curriculum-api-2023/fixtures/searchPage.fixture";

const searchResultsData = searchResultsItem()[0];

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
    ...searchResultsData,
  },
  render: (args) => <Component {...args} />,
};

// SearchDropdown.storyName = "MyComponent";
