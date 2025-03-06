import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { Meta, StoryObj } from "@storybook/react";

import { CurricFiltersChildSubjects as Component } from "./CurricFiltersChildSubjects";
import { basicSetup } from "./CurricFiltersChildSubjects.fixtures";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Component>;

export const CurricFiltersChildSubjects: Story = {
  args: {
    data: basicSetup,
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
