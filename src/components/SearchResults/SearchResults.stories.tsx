import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { SearchProvider } from "../../context/Search/SearchContext";

import Component from "./SearchResults";
import { searchHits } from "./SearchResults.test";

export default {
  title: "Form Fields/Search",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <SearchProvider>
    <Component {...args} />
  </SearchProvider>
);

export const SearchResults = Template.bind({});

SearchResults.args = searchHits;
