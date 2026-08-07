import { Meta, StoryObj } from "@storybook/nextjs";

import { CurricFiltersYears as Component } from "./CurricFiltersYears";
import { basicSetup } from "./CurricFiltersYears.fixtures";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Component>;

export const CurricFiltersYears: Story = {
  args: {
    data: basicSetup,
    filters: {
      childSubjects: [],
      subjectCategories: [],
      tiers: [],
      years: [],
      threads: [],
      pathways: [],
      keystages: [],
    },
    slugs: {
      phaseSlug: "primary",
      subjectSlug: "maths",
      ks4OptionSlug: null,
    },
    onChangeFilters: () => {},
  },
  render: function Render(args) {
    return <Component {...args} />;
  },
};
