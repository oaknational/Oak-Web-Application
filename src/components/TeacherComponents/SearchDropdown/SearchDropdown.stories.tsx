import { Meta, StoryObj } from "@storybook/nextjs";

import Component from "./SearchDropdown";

import { searchResultsItem } from "@/node-lib/curriculum-api-2023/fixtures/searchPage.fixture";

const searchResultsData = searchResultsItem()[0]!;

const meta = {
  component: Component,
  argTypes: {},
} satisfies Meta<typeof Component>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SearchDropdown: Story = {
  args: {
    ...searchResultsData,
    isToggleOpen: true,
    isHovered: false,
    label: "Search Results",
    dropdownContent: searchResultsData.pathways,
  },
  render: (args) => <Component {...args} />,
};
