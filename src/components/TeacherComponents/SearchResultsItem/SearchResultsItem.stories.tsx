import { Meta, StoryObj } from "@storybook/nextjs";

import Component from "./SearchResultsItem";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";
import { hitsFixture } from "@/context/Search/search-api/2023/searchResults.fixture";
import keyStagesFixture from "@/node-lib/curriculum-api-2023/fixtures/keyStages.fixture";
import { getSearchHitObject } from "@/app/(core)/teachers/search/helpers/index";

const meta = {
  decorators: [AnalyticsDecorator],
  component: Component,
  argTypes: {},
} satisfies Meta<typeof Component>;

export default meta;

const hit = hitsFixture[0]!;

const allKeyStages = keyStagesFixture().keyStages;
const searchHitObject = getSearchHitObject(hit, allKeyStages)!;

type Story = StoryObj<typeof meta>;

export const SearchResultsItem: Story = {
  args: {
    ...searchHitObject,
  },
  render: (args) => <Component {...args} />,
};
