import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import MyLibraryHeader from "./MyLibraryHeader";

const meta: Meta<typeof MyLibraryHeader> = {
  component: MyLibraryHeader,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof MyLibraryHeader>;

export const Default: Story = {
  render: () => (
    <OakThemeProvider theme={oakDefaultTheme}>
      <MyLibraryHeader />
    </OakThemeProvider>
  ),
};
