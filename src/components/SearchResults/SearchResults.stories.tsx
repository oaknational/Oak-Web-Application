import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { SearchProvider } from "../../context/Search/SearchContext";

import Component from "./SearchResults";
import { searchResult } from "./SearchResults.test";

const searchResults = [];
for (let i = 0; i <= 20; i++) {
  searchResults.push({ _source: { ...searchResult._source, id: i } });
}

export default {
  title: "Lists/Search results",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <SearchProvider>
    <Component {...args} />
  </SearchProvider>
);

export const SearchResults = Template.bind({});
