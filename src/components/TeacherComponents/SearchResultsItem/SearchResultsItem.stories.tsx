import { Meta } from "@storybook/react";

import Component from "./SearchResultsItem";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";
import elasticResponseFixture from "@/context/Search/search-api/2023/elasticResponse.2023.fixture.json";
import teachersHomePageFixture from "@/node-lib/curriculum-api-2023/fixtures/teachersHomePage.fixture";
import { searchResultsHitSchema } from "@/context/Search/search.schema";
import { getSearchHitObject } from "@/context/Search/search.helpers";

export default {
  decorators: [AnalyticsDecorator],
  component: Component,
  argTypes: {},
} as Meta<typeof Component>;

const hit = searchResultsHitSchema.parse(elasticResponseFixture.hits.hits[0]);

const allKeyStages = teachersHomePageFixture().keyStages;
const searchHitObject = getSearchHitObject(hit, allKeyStages);

export const SearchResultsItem = {
  args: {
    ...searchHitObject,
  },
};
