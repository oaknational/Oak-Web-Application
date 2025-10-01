import { Meta, StoryObj } from "@storybook/nextjs";

import Component from "./SearchDropdown";

import { searchResultsItem } from "@/node-lib/curriculum-api-2023/fixtures/searchPage.fixture";

const searchResultsData = searchResultsItem()[0];

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof Component>;

export const SearchDropdown: Story = {
  args: {
    ...searchResultsData,
  },
  render: (args) => <Component {...args} />,
};
