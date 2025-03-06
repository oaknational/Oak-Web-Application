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
