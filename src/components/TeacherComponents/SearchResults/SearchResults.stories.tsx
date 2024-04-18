import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./SearchResults";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";
import elasticResponseFixture from "@/context/Search/search-api/2023/elasticResponse.2023.fixture.json";
import teachersHomePageFixture from "@/node-lib/curriculum-api/fixtures/teachersHomePage.fixture";
import { searchResultsHitsSchema } from "@/context/Search/search.schema";

export default {
  decorators: [AnalyticsDecorator],
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

const hits = searchResultsHitsSchema.parse(elasticResponseFixture.hits.hits);
const allKeyStages = teachersHomePageFixture().keyStages;
export const SearchResults = Template.bind({});
SearchResults.args = {
  hits,
  allKeyStages,
};
