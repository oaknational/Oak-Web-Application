import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import AnalyticsDecorator from "../../storybook-decorators/AnalyticsDecorator";
import elasticResponseFixture from "../../context/Search/elasticResponse.fixture.json";
import teachersHomePageFixture from "../../node-lib/curriculum-api/fixtures/teachersHomePage.fixture";

import Component from "./SearchResults";

import { searchResultsHitsSchema } from "@/context/Search/search.schema";

export default {
  title: "Lists/Search Results",
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
