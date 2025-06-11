import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { ClerkProvider } from "@clerk/nextjs";

import OakSignUpButton from "./OakSignUpButton";

const meta: Meta<typeof OakSignUpButton> = {
  component: OakSignUpButton,
  args: {},
};

export default meta;

type Story = StoryObj<typeof OakSignUpButton>;

export const Default: Story = {
  render: () => (
    <ClerkProvider>
      <OakThemeProvider theme={oakDefaultTheme}>
        <OakSignUpButton />
      </OakThemeProvider>
    </ClerkProvider>
  ),
  args: {},
};
