import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import {
  OakFlex,
  OakHeading,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";
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
        <OakFlex $flexDirection="column" $gap="space-between-m">
          <OakHeading tag="h1" $font="heading-light-7">
            Sign in / out via OWA to test the states on this button
          </OakHeading>
          <OakSignUpButton />
        </OakFlex>
      </OakThemeProvider>
    </ClerkProvider>
  ),
  args: {},
};
