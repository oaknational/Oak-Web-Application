import { Meta, StoryObj } from "@storybook/react";


import RegistrationAside from "../RegistrationAside/ResgistrationAside";

import Component from "./RegistrationLayout";

import {
  OakBox,
  oakDefaultTheme,
  OakP,
  OakThemeProvider,
} from "@oaknational/oak-components";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {
    useAlternateLayout: {
      control: {
        type: "boolean",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Component>;

export const AlternateRegistrationLayout: Story = {
  args: {
    useAlternateLayout: true,
    asideSlot: <RegistrationAside useNew={true} />,
    termsSlot: (
      <OakBox>
        <OakP>Terms and conditions</OakP>
      </OakBox>
    ),
    children: (
      <OakBox $width="all-spacing-18" $ba="border-solid-m">
        Sign up form
      </OakBox>
    ),
  },
  render: (args) => {
    return (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Component {...args} />
      </OakThemeProvider>
    );
  },
};

export const RegistrationLayout: Story = {
  args: {
    useAlternateLayout: false,
    asideSlot: <RegistrationAside useNew={false} />,
    termsSlot: (
      <OakBox>
        <OakP>Terms and conditions</OakP>
      </OakBox>
    ),
  },
  render: (args) => {
    return (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Component {...args} />
      </OakThemeProvider>
    );
  },
};
