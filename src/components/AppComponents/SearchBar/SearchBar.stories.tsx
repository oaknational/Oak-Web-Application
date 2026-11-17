import type { Meta, StoryObj } from "@storybook/nextjs";

import Component from "./SearchBar";

import TeacherBrowseAnalyticsDecorator from "@/storybook-decorators/TeacherBrowseAnalyticsDecorator";

const meta: Meta<typeof Component> = {
  decorators: [TeacherBrowseAnalyticsDecorator],
  component: Component,
};

export default meta;
type Story = StoryObj<typeof Component>;

export const SearchBar: Story = {
  render: () => <Component />,
};
