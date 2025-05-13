import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { Meta, StoryObj } from "@storybook/react";
import { ComponentProps } from "react";

import { mockOptionalityUnit } from "./CurricUnitModalContent.fixtures";

import Component from "./";

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
  render: function Render(args: ComponentProps<typeof Component>) {
    return (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Component {...args} />
      </OakThemeProvider>
    );
  },
};
