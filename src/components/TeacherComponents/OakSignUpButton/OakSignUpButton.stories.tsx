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
  argTypes: {
    actionProps: {
      control: {
        type: "select",
      },
      options: ["none", "download", "save"],
      mapping: {
        none: undefined,
        download: {
          onClick: () => console.log("Download clicked"),
          name: "Download",
          iconName: "download",
          isTrailingIcon: true,
        },
        save: {
          onClick: () => console.log("Save clicked"),
          name: "Save",
          iconName: "save",
          isTrailingIcon: false,
        },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof OakSignUpButton>;

export const Default: Story = {
  render: (args) => (
    <ClerkProvider>
      <OakThemeProvider theme={oakDefaultTheme}>
        <OakFlex $flexDirection="column" $gap="space-between-m">
          <OakHeading tag="h1" $font="heading-light-7">
            Sign in / out via OWA to test the states on this button
          </OakHeading>
          <OakSignUpButton {...args} />
        </OakFlex>
      </OakThemeProvider>
    </ClerkProvider>
  ),
  args: {
    actionProps: {
      onClick: () => console.log("Download clicked"),
      name: "Download",
      iconName: "download",
      isTrailingIcon: true,
    },
  },
};
