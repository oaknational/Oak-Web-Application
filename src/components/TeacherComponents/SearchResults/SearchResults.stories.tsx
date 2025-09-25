import { Meta } from "@storybook/nextjs";

import Component from "./SearchResults";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";
import elasticResponseFixture from "@/context/Search/search-api/2023/elasticResponse.2023.fixture.json";
import keyStagesFixture from "@/node-lib/curriculum-api-2023/fixtures/keyStages.fixture";
import { searchResultsHitsSchema } from "@/context/Search/search.schema";

export default {
  decorators: [AnalyticsDecorator],
  component: Component,
  argTypes: {},
} as Meta<typeof Component>;

const hits = searchResultsHitsSchema.parse(elasticResponseFixture.hits.hits);
const allKeyStages = keyStagesFixture().keyStages;

export const SearchResults = {
  args: {
    hits,
    allKeyStages,
  },
};
