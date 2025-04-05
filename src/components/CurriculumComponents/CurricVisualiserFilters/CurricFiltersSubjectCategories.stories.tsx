import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { Meta, StoryObj } from "@storybook/react";

import { CurricFiltersSubjectCategories as Component } from "./CurricFiltersSubjectCategories";
import { ks4Setup } from "./CurricFiltersSubjectCategories.fixtures";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Component>;

export const CurricFiltersSubjectCategories: Story = {
  args: {
    data: ks4Setup,
    filters: {
      childSubjects: [],
      subjectCategories: [],
      tiers: [],
      years: ["10", "11"],
      threads: [],
    },
    onChangeFilters: () => {},
  },
  render: function Render(args) {
    return (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Component {...args} />
      </OakThemeProvider>
    );
  },
};
