import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import MyLibrary, { CollectionData } from "./MyLibrary";

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

const generateCollectionData = (count: number): CollectionData => {
  return Array.from({ length: count }, (_, index) => ({
    subject: `Subject ${index + 1}`,
    subheading: index % 2 === 0 ? `AQA foundation` : `Edexcel higher`,
    examboard: index % 2 === 0 ? "AQA" : "Edexcel",
    tier: index % 2 === 0 ? "foundation" : "higher",
    keystage: "KS4",
    units: [
      {
        unitSlug: `unit-${index + 1}`,
        unitTitle: `Unit ${index + 1}: Topic`,
        savedAt: new Date().toISOString(),
        lessons: [
          {
            slug: `lesson-${index + 1}-1`,
            title: `Lesson ${index + 1} - Part 1`,
            state: "saved",
            order: 1,
          },
          {
            slug: `lesson-${index + 1}-2`,
            title: `Lesson ${index + 1} - Part 2`,
            state: "saved",
            order: 2,
          },
        ],
      },
    ],
    programmeSlug: `programme-${index + 1}`,
  }));
};

export const Default: Story = {
  render: (args) => (
    <OakThemeProvider theme={oakDefaultTheme}>
      <MyLibrary {...args} />
    </OakThemeProvider>
  ),
  args: {
    collectionData: generateCollectionData(3),
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
    collectionData: generateCollectionData(20),
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
