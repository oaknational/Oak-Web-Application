import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { Meta, StoryObj } from "@storybook/react";

import { CurricVisualiserFiltersDesktop as Component } from ".";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Component>;

export const CurricVisualiserFiltersMobile: Story = {
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
    slugs: {
      subjectSlug: "english",
      phaseSlug: "primary",
      ks4OptionSlug: null,
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
