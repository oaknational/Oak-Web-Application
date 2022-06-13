import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { SearchProvider } from "../../context/Search/SearchContext";

import Component from "./SearchForm";

export default {
  title: "Inputs/search",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <SearchProvider>
    <Component {...args} />
  </SearchProvider>
);

export const SearchForm = Template.bind({});
