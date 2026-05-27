import React from "react";
import { StoryObj, Meta } from "@storybook/react";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import { DownloadSuccessHeader } from "./DownloadSuccessHeader";

const meta: Meta<typeof DownloadSuccessHeader> = {
  component: DownloadSuccessHeader,
  title: "App/Programmes/Units/Lessons/DownloadSuccessHeader",
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Story />
      </OakThemeProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof DownloadSuccessHeader>;

export const Default: Story = {
  args: {
    href: "/programmes",
  },
};
