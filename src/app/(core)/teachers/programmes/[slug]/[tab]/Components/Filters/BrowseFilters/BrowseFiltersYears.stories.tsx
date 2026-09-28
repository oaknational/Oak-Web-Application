import { Meta, StoryObj } from "@storybook/nextjs";

import { BrowseFiltersYears as Component } from "./BrowseFiltersYears";

import { basicSetup } from "@/components/CurriculumComponents/CurricVisualiserFilters/CurricFiltersYears.fixtures";
import { BrowseFiltersProvider } from "@/context/BrowseFilters";
import TeacherBrowseAnalyticsDecorator from "@/storybook-decorators/TeacherBrowseAnalyticsDecorator";

const meta: Meta<typeof Component> = {
  component: Component,
  decorators: [TeacherBrowseAnalyticsDecorator],
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Component>;

export const BrowseFiltersYears: Story = {
  args: {
    data: basicSetup,
  },
  render: function Render(args) {
    return (
      <BrowseFiltersProvider
        defaultFilter={{
          childSubjects: [],
          subjectCategories: [],
          tiers: [],
          years: [],
          threads: [],
          pathways: [],
          keystages: [],
        }}
      >
        <Component {...args} />
      </BrowseFiltersProvider>
    );
  },
};
