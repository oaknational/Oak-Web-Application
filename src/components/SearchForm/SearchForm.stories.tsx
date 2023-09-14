import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import AnalyticsDecorator from "../../storybook-decorators/AnalyticsDecorator";

import Component from "./SearchForm";

export default {
  title: "Form Fields/Search",
  decorators: [AnalyticsDecorator],
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const SearchInput = Template.bind({});
SearchInput.args = {
  placeholderText: "Search by keyword or topic",
};
