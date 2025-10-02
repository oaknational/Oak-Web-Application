import React from "react";
import { Meta, StoryObj } from "@storybook/nextjs";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import NoSavedContent from "./NoSavedContent";

const meta: Meta<typeof NoSavedContent> = {
  component: NoSavedContent,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof NoSavedContent>;

export const Default: Story = {
  render: () => (
    <OakThemeProvider theme={oakDefaultTheme}>
      <NoSavedContent />
    </OakThemeProvider>
  ),
};
