import { Meta } from "@storybook/nextjs";

import Component from "./SearchForm";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";

export default {
  decorators: [AnalyticsDecorator],
  component: Component,
} as Meta<typeof Component>;

export const SearchInput = {
  args: {
    placeholderText: "Search by keyword or topic",
  },
};
