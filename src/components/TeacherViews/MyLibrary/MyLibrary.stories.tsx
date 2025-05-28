import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import MyLibrary from "./MyLibrary";
import { generateMockCollectionData } from "./MyLibrary.test";

const meta: Meta<typeof MyLibrary> = {
  component: MyLibrary,
  tags: ["autodocs"],
  argTypes: {
    isLoading: {
      control: {
        type: "boolean",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof MyLibrary>;

export const Default: Story = {
  render: (args) => (
    <OakThemeProvider theme={oakDefaultTheme}>
      <MyLibrary {...args} />
    </OakThemeProvider>
  ),
  args: {
    collectionData: generateMockCollectionData(3),
    isLoading: false,
  },
};

export const LongSideMenu: Story = {
  render: (args) => (
    <OakThemeProvider theme={oakDefaultTheme}>
      <MyLibrary {...args} />
    </OakThemeProvider>
  ),
  args: {
    collectionData: generateMockCollectionData(20),
    isLoading: false,
  },
};

export const NoSavedContent: Story = {
  render: (args) => (
    <OakThemeProvider theme={oakDefaultTheme}>
      <MyLibrary {...args} />
    </OakThemeProvider>
  ),
  args: {
    collectionData: [],
    isLoading: false,
  },
};
