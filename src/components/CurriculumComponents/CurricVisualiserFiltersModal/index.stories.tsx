import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { Meta, StoryObj } from "@storybook/react";

import { basicSetup } from "./index.fixtures";

import { CurricMobileFilterModal as Component } from ".";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Component>;

export const CurricMobileFilterModal: Story = {
  args: {
    data: basicSetup,
    filters: {
      childSubjects: [],
      subjectCategories: [],
      tiers: [],
      years: ["7", "8", "9", "10", "11"],
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
