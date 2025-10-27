import { Meta, StoryObj } from "@storybook/nextjs";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import { CurricFiltersYears as Component } from "./CurricFiltersYears";
import { basicSetup } from "./CurricFiltersYears.fixtures";

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
