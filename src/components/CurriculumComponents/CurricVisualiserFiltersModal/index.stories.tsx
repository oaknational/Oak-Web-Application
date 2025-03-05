import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { Meta, StoryObj } from "@storybook/react";

import { CurriculumMobileFilterModal as Component } from ".";

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
    onOpenModal: () => {},
    filters: {
      childSubjects: [],
      subjectCategories: [],
      tiers: [],
      years: [],
      threads: [],
    },
    onChangeFilters: () => {},
    trackingData: {
      subjectSlug: "english",
      subjectTitle: "English",
      phaseSlug: "primary",
    },
  },
  render: function Render(args) {
    return (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Component {...args} />
      </OakThemeProvider>
    );
  },
};
