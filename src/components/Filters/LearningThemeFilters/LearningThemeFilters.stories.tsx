import { Meta, StoryObj } from "@storybook/react";

import AnalyticsDecorator from "../../../storybook-decorators/AnalyticsDecorator";

import Component from ".";

const meta: Meta<typeof Component> = {
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
      programmeSlug: "some-programme",
    },
  },
  render: (args) => {
    return <Component {...args} />;
  },
};
