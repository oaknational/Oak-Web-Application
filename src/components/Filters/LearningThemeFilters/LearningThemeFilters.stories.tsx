import { Meta, StoryObj } from "@storybook/react";

import AnalyticsDecorator from "../../../storybook-decorators/AnalyticsDecorator";

import Component from ".";

const meta: Meta<typeof Component> = {
  title: "Filters/Category Filter List/LearningThemeFilters",
  decorators: [AnalyticsDecorator],
  component: Component,
};

export default meta;
type Story = StoryObj<typeof Component>;

export const LearningThemeFilters: Story = {
  args: {
    selectedThemeSlug: "some-theme",
    learningThemes: [],
    linkProps: {
      page: "unit-index",
      viewType: "teachers",
      programmeSlug: "some-programme",
    },
  },
  render: (args) => {
    return <Component {...args} />;
  },
};
