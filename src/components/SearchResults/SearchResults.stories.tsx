import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { searchResultsHitsSchema } from "../../context/Search/helpers";
import elasticResponseFixture from "../../context/Search/elasticResponse.fixture.json";

import Component from "./SearchResults";

export default {
  title: "Lists/Search Results",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

const hits = searchResultsHitsSchema.parse(elasticResponseFixture.hits.hits);

export const SearchResults = Template.bind({});
SearchResults.args = {
  hits,
};
