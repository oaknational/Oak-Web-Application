import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { Meta, StoryObj } from "@storybook/react";

import { CurricFiltersTiers as Component } from "./CurricFiltersTiers";
import { ks4Setup } from "./CurricFiltersTiers.fixtures";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Component>;

export const CurricFiltersTiers: Story = {
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
    return (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Component {...args} />
      </OakThemeProvider>
    );
  },
};
