import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { Meta, StoryObj } from "@storybook/react";

import { CurricFiltersChildSubjects as Component } from "./CurricFiltersChildSubjects";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Component>;

export const CurriculumVisualiserFiltersMobile: Story = {
  args: {
    data: {
      yearData: {},
      threadOptions: [],
      yearOptions: [],
    },
    filters: {
      childSubjects: [],
      subjectCategories: [],
      tiers: [],
      years: [],
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
