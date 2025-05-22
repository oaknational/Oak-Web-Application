import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { Meta, StoryObj } from "@storybook/react";
import { ComponentProps } from "react";

import {
  mockOptionalityUnit,
  mockUnitWhyThisWhyNow,
} from "./CurricUnitModalContent.fixtures";

import Component from ".";

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

export const CurricUnitModalOptionality: Story = {
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

export const CurricUnitModalOptionalityOptions: Story = {
  args: {
    unitData: exampleYearData["7"].units[0],
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

const exampleYearDataWhyThisWhyNow = {
  "7": createYearData({
    units: [mockUnitWhyThisWhyNow],
  }),
};

export const CurricUnitModalWhyThisWhyNow: Story = {
  args: {
    unitData: exampleYearDataWhyThisWhyNow["7"].units[0],
    yearData: exampleYearDataWhyThisWhyNow,
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
