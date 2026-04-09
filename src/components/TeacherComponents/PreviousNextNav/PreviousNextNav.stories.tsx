import React from "react";
import { Meta, StoryObj } from "@storybook/nextjs";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import PreviousNextNav from "./PreviousNextNav";

const meta: Meta<typeof PreviousNextNav> = {
  component: PreviousNextNav,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Story />
      </OakThemeProvider>
    ),
  ],
  args: {
    currentIndex: 3,
    backgroundColorLevel: 3,
    browseItem: "unit",
    previous: {
      title:
        "Ullamcorper auctor volutpat turpis dictumst aliquam et et dui mattis ullamcorper.",
      href: "www.google.com",
    },
    next: {
      title:
        "Ullamcorper auctor volutpat turpis dictumst aliquam et et dui mattis ullamcorper.",
      href: "www.google.com",
    },
  },
};
export default meta;

type Story = StoryObj<typeof PreviousNextNav>;

export const Default: Story = {};
