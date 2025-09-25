import React from "react";
import { Meta, StoryObj } from "@storybook/nextjs";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import MyLibrary from "./MyLibrary";

import { generateMockCollectionData } from "@/fixtures/teachers/myLibrary/collectionData";

const meta: Meta<typeof MyLibrary> = {
  component: MyLibrary,
  tags: ["autodocs"],
  argTypes: {
    isLoading: {
      control: {
        type: "boolean",
      },
    },
    collectionData: {
      control: {
        type: "radio",
      },
      options: ["none", "shortList", "longList"],
      mapping: {
        none: [],
        shortList: generateMockCollectionData(3),
        longList: generateMockCollectionData(20),
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
    collectionData: generateMockCollectionData(1),
    isLoading: false,
    onSaveToggle: () => {},
    isUnitSaved: () => false,
  },
};
