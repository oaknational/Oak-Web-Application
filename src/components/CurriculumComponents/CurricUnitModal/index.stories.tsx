import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { Meta, StoryObj } from "@storybook/react";

import Component from "./CurricUnitModal";
import { mockOptionalityUnit } from "./CurricUnitModal.fixtures";

import { createYearData } from "@/fixtures/curriculum/yearData";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Component>;

const exampleYearData = {
  "7": createYearData({
    units: [mockOptionalityUnit],
  }),
};

export const CurricUnitModal: Story = {
  args: {
    unitData: exampleYearData["7"].units[0],
    unitOptionData: exampleYearData["7"].units[0]?.unit_options[0],
    yearData: exampleYearData,
    selectedThread: "",
    basePath: "",
  },
  render: function Render(args) {
    return (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Component {...args} />
      </OakThemeProvider>
    );
  },
};
