import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from ".";

export default {
  title: "Filters/Category Filter List/LearningThemeFilters",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
  return <Component {...args} />;
};

export const LearningThemeFilters = Template.bind({});
LearningThemeFilters.args = {
  selectedThemeSlug: "some-theme",
  learningThemes: [],
};
