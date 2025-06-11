import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import {
  OakFlex,
  OakHeading,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";
import { ClerkProvider, SignIn, SignOutButton } from "@clerk/nextjs";

import OakSignUpButton from "./OakSignUpButton";

const meta: Meta<typeof OakSignUpButton> = {
  component: OakSignUpButton,
  argTypes: {
    signUpProps: {
      control: {
        type: "select",
      },
      defaultValue: "none",
      options: ["none", "withIcons", "withText"],
      mapping: {
        none: undefined,
        withIcons: {
          iconName: "arrow-right",
          isTrailingIcon: true,
        },
        withText: {
          buttonName: "Register to continue",
        },
      },
    },
    actionProps: {
      control: {
        type: "select",
      },
      defaultValue: "download",
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
          <OakFlex
            $background="mint"
            $justifyContent="center"
            $alignItems="center"
            $borderRadius="border-radius-s"
            $pa="inner-padding-xl"
          >
            <OakSignUpButton {...args} />
          </OakFlex>
          <OakHeading tag="h1" $font="heading-light-7">
            Sign in / out via OWA to test the states on this button (or use the
            clerk components below, you may need to refresh)
          </OakHeading>
          <SignOutButton>Quick sign out</SignOutButton>
          <SignIn routing="hash" />
        </OakFlex>
      </OakThemeProvider>
    </ClerkProvider>
  ),
};
