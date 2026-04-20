import React from "react";
import { StoryObj, Meta } from "@storybook/react";
import {
  oakDefaultTheme,
  OakPrimaryButton,
  OakThemeProvider,
} from "@oaknational/oak-components";

import HeaderNavFooter from "./HeaderNavFooter";

const meta: Meta<typeof HeaderNavFooter> = {
  component: HeaderNavFooter,
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

type Story = StoryObj<typeof HeaderNavFooter>;

export const Default: Story = {
  args: {
    backgroundColorLevel: 1,
    prevHref: "www.google.com",
    nextHref: "www.google.com",
    viewHref: "www.google.com",
    type: "lesson",
    actionButton: <OakPrimaryButton>Action</OakPrimaryButton>,
  },
};
