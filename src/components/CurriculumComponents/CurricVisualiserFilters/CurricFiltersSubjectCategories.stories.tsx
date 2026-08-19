import { Meta, StoryObj } from "@storybook/nextjs";

import { CurricFiltersSubjectCategories as Component } from "./CurricFiltersSubjectCategories";
import { ks4Setup } from "./CurricFiltersSubjectCategories.fixtures";

import TeacherBrowseAnalyticsDecorator from "@/storybook-decorators/TeacherBrowseAnalyticsDecorator";
import withBrowseFilters from "@/storybook-decorators/BrowseFiltersDecorator";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Component>;

export const CurricFiltersSubjectCategories: Story = {
  args: {
    data: ks4Setup,
    slugs: {
      phaseSlug: "primary",
      subjectSlug: "maths",
      ks4OptionSlug: null,
    },
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
