import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { SearchProvider } from "../../context/Search/SearchContext";

import Component from "./SearchResults";
import { searchResults } from "./SearchResults.test";

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

SearchResults.args = { hits: searchResults };
