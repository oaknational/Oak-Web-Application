import { Meta, StoryObj } from "@storybook/nextjs";

import Component from ".";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";

const meta: Meta<typeof Component> = {
  decorators: [AnalyticsDecorator],
  component: Component,
};

export default meta;
type Story = StoryObj<typeof Component>;

export const UnitsLearningThemeFilters: Story = {
  args: {
    selectedThemeSlug: "some-theme",
    learningThemes: [],
  },
  render: (args) => {
    return <Component {...args} />;
  },
};
