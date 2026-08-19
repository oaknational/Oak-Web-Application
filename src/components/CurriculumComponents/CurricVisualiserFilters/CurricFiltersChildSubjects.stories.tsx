import { Meta, StoryObj } from "@storybook/nextjs";

import { CurricFiltersChildSubjects as Component } from "./CurricFiltersChildSubjects";
import { ks4Setup } from "./CurricFiltersChildSubjects.fixtures";

import TeacherBrowseAnalyticsDecorator from "@/storybook-decorators/TeacherBrowseAnalyticsDecorator";
import withBrowseFilters from "@/storybook-decorators/BrowseFiltersDecorator";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Component>;

export const CurricFiltersChildSubjects: Story = {
  args: {
    data: ks4Setup,
  },
  decorators: [
    TeacherBrowseAnalyticsDecorator,
    withBrowseFilters({
      childSubjects: [],
      subjectCategories: [],
      tiers: [],
      years: ["10", "11"],
      threads: [],
      pathways: [],
      keystages: [],
    }),
  ],
  render: function Render(args) {
    return <Component {...args} />;
  },
};
