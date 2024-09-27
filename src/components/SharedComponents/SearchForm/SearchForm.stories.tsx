import React from "react";
import { StoryFn, Meta } from "@storybook/react";

import Component from "./SearchForm";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";

export default {
  decorators: [AnalyticsDecorator],
  component: Component,
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => <Component {...args} />;

export const SearchInput = Template.bind({});
SearchInput.args = {
  placeholderText: "Search by keyword or topic",
};
