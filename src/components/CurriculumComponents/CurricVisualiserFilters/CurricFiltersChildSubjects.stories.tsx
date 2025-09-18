import { Meta, StoryObj } from "@storybook/react";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import { CurricFiltersChildSubjects as Component } from "./CurricFiltersChildSubjects";
import { ks4Setup } from "./CurricFiltersChildSubjects.fixtures";

const meta: Meta<typeof Component> = {
  component: Component,
  decorators: [
    (Story) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Story />
      </OakThemeProvider>
    ),
  ],
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Component>;

export const CurricFiltersChildSubjects: Story = {
  args: {
    data: ks4Setup,
    filters: {
      childSubjects: [],
      subjectCategories: [],
      tiers: [],
      years: ["10", "11"],
      threads: [],
      pathways: [],
    },
    onChangeFilters: () => {},
  },
  render: function Render(args) {
    return <Component {...args} />;
  },
};
