import { Meta, StoryObj } from "@storybook/nextjs";

import { BrowseFiltersYears as Component } from "./BrowseFiltersYears";
import { basicSetup } from "./CurricFiltersYears.fixtures";

import { BrowseFiltersProvider } from "@/context/BrowseFilters";

const meta: Meta<typeof Component> = {
  component: Component,
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
