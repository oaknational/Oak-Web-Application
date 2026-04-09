import React from "react";
import { Meta, StoryObj } from "@storybook/nextjs";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import BrowseNavItem from "./BrowseNavItem";

const meta: Meta<typeof BrowseNavItem> = {
  component: BrowseNavItem,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Story />
      </OakThemeProvider>
    ),
  ],
  args: {
    index: "1",
    backgroundColorLevel: 3,
    title:
      "Ullamcorper auctor volutpat turpis dictumst aliquam et et dui mattis ullamcorper.",
    navDirection: "prev",
    browseItem: "unit",
    linkHref: "www.google.com",
  },
};
export default meta;

type Story = StoryObj<typeof BrowseNavItem>;

export const Default: Story = {};
