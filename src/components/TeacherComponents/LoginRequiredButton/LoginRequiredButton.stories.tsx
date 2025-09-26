import React from "react";
import { Meta, StoryObj } from "@storybook/nextjs";
import {
  OakFlex,
  OakHeading,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";
import { ClerkProvider, SignIn, SignOutButton } from "@clerk/nextjs";

import LoginRequiredButton from "./LoginRequiredButton";

const meta: Meta<typeof LoginRequiredButton> = {
  component: LoginRequiredButton,
  parameters: {
    controls: {
      include: ["signUpProps", "actionProps", "buttonVariant", "sizeVariant"],
    },
  },
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
      defaultValue: "georestrictedDownload",
      options: ["none", "georestrictedDownload", "save", "loadingDownload"],
      mapping: {
        none: undefined,
        georestrictedDownload: {
          onClick: () => console.log("Download clicked"),
          name: "Download",
          iconName: "download",
          isTrailingIcon: true,
          isActionGeorestricted: true,
        },
        save: {
          onClick: () => console.log("Save clicked"),
          name: "Save",
          iconName: "save",
          isTrailingIcon: false,
          isActionGeorestricted: false,
          showNewTag: true,
        },
        loadingDownload: {
          onClick: () => console.log("Loading download clicked"),
          name: "Downloading...",
          iconName: "download",
          isTrailingIcon: true,
          isActionGeorestricted: false,
          loading: true,
        },
      },
    },
    buttonVariant: {
      control: {
        type: "radio",
      },
      options: ["primary", "secondary", "tertiary"],
      defaultValue: "primary",
    },
    sizeVariant: {
      control: {
        type: "radio",
      },
      options: ["small", "large"],
      defaultValue: "large",
    },
  },
};

export default meta;

type Story = StoryObj<typeof LoginRequiredButton>;

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
            <LoginRequiredButton {...args} />
          </OakFlex>
          <OakHeading tag="h1" $font="heading-light-7">
            Sign in / out via OWA to test the states on this button (or use the
            clerk components below, you may need to refresh and won't be able to
            onboard a new user)
          </OakHeading>
          <SignOutButton>Quick sign out</SignOutButton>
          <SignIn routing="hash" />
        </OakFlex>
      </OakThemeProvider>
    </ClerkProvider>
  ),
};
