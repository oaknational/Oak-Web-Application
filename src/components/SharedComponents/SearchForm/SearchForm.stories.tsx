import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./SearchForm";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";


export default {
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
