import { Meta, StoryObj } from "@storybook/react";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import { CurricFiltersSubjectCategories as Component } from "./CurricFiltersSubjectCategories";
import { ks4Setup } from "./CurricFiltersSubjectCategories.fixtures";

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

export const CurricFiltersSubjectCategories: Story = {
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
