import { Meta } from "@storybook/nextjs";

import Component from "./SearchForm";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";
import TeacherBrowseAnalyticsDecorator from "@/storybook-decorators/TeacherBrowseAnalyticsDecorator";

export default {
  decorators: [AnalyticsDecorator, TeacherBrowseAnalyticsDecorator],
  component: Component,
} as Meta<typeof Component>;

export const SearchInput = {
  args: {
    placeholderText: "Search by keyword or topic",
  },
};
