import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { ClerkProvider } from "@clerk/nextjs";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import CopyrightRestrictionBanner from "./CopyrightRestrictionBanner";

const meta: Meta<typeof CopyrightRestrictionBanner> = {
  component: CopyrightRestrictionBanner,
  argTypes: {
    componentType: {
      control: "select",
      options: [
        "lesson_listing",
        "lesson_overview",
        "lesson_media_clips",
        "lesson_downloads",
      ],
    },
  },
};
export default meta;

type Story = StoryObj<typeof CopyrightRestrictionBanner>;

export const Default: Story = {
  args: {
    isGeorestricted: true,
    isLoginRequired: true,
    componentType: "lesson_listing",
  },
  render: (args) => (
    <ClerkProvider>
      <OakThemeProvider theme={oakDefaultTheme}>
        <CopyrightRestrictionBanner {...args} />
      </OakThemeProvider>
    </ClerkProvider>
  ),
};
