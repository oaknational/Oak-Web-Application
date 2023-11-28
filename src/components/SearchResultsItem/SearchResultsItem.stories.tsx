import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import AnalyticsDecorator from "../../storybook-decorators/AnalyticsDecorator";
import elasticResponseFixture from "../../context/Search/elasticResponse.2020.fixture.json";
import teachersHomePageFixture from "../../node-lib/curriculum-api/fixtures/teachersHomePage.fixture";

import Component from "./SearchResultsItem";

import { searchResultsHitSchema } from "@/context/Search/search.schema";
import { getSearchHitObject } from "@/context/Search/search.helpers";

export default {
  title: "Lists/Search Results",
  decorators: [AnalyticsDecorator],
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

const hit = searchResultsHitSchema.parse(elasticResponseFixture.hits.hits[0]);

const allKeyStages = teachersHomePageFixture().keyStages;
const searchHitObject = getSearchHitObject(hit, allKeyStages);
export const SearchResults = Template.bind({});
SearchResults.args = {
  ...searchHitObject,
};
