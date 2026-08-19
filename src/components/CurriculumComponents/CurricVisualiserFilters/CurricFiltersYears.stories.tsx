import { Meta, StoryObj } from "@storybook/nextjs";

import { CurricFiltersYears as Component } from "./CurricFiltersYears";
import { basicSetup } from "./CurricFiltersYears.fixtures";

import TeacherBrowseAnalyticsDecorator from "@/storybook-decorators/TeacherBrowseAnalyticsDecorator";
import withBrowseFilters from "@/storybook-decorators/BrowseFiltersDecorator";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Component>;

export const CurricFiltersYears: Story = {
  args: {
    data: basicSetup,
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
      years: [],
      threads: [],
      pathways: [],
      keystages: [],
    }),
  ],
  render: function Render(args) {
    return <Component {...args} />;
  },
};
