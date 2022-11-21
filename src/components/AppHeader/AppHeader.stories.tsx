import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { SearchProvider } from "../../context/Search/SearchContext";

import Component from "./AppHeader";

export default {
  title: "Headers & Footers/App Header",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <SearchProvider>
    <Component {...args} />
  </SearchProvider>
);

export const AppHeader = Template.bind({});
AppHeader.args = {};
