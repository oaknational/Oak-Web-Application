import { ComponentStory, ComponentMeta } from "@storybook/react";

import AnalyticsDecorator from "../../../storybook-decorators/AnalyticsDecorator";

import Component from ".";

export default {
  title: "Filters/Category Filter List/LearningThemeFilters",
  decorators: [AnalyticsDecorator],
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
  return <Component {...args} />;
};

export const LearningThemeFilters = Template.bind({});
LearningThemeFilters.args = {
  selectedThemeSlug: "some-theme",
  learningThemes: [],
  linkProps: {
    page: "unit-index",
    viewType: "teachers",
    programme: "some-programme",
  },
};
