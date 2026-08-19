import { Meta, StoryObj } from "@storybook/nextjs";

import { CurricFiltersTiers as Component } from "./CurricFiltersTiers";
import { ks4Setup } from "./CurricFiltersTiers.fixtures";

import TeacherBrowseAnalyticsDecorator from "@/storybook-decorators/TeacherBrowseAnalyticsDecorator";
import withBrowseFilters from "@/storybook-decorators/BrowseFiltersDecorator";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Component>;

export const CurricFiltersTiers: Story = {
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
