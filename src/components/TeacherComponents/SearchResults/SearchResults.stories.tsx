import { Meta, StoryObj } from "@storybook/nextjs";

import Component from "./SearchResults";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";
import { hitsFixture as hits } from "@/context/Search/search-api/2023/searchResults.fixture";
import keyStagesFixture from "@/node-lib/curriculum-api-2023/fixtures/keyStages.fixture";

const meta = {
  decorators: [AnalyticsDecorator],
  component: Component,
  argTypes: {},
} satisfies Meta<typeof Component>;

export default meta;

const allKeyStages = keyStagesFixture().keyStages;

type Story = StoryObj<typeof meta>;

export const SearchResults: Story = {
  args: {
    hits,
    allKeyStages,
    searchResultOpened: () => {},
    searchResultExpanded: () => {},
  },
  render: (args) => <Component {...args} />,
};
