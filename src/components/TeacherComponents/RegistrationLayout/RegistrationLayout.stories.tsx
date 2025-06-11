import { Meta, StoryObj } from "@storybook/react";
import {
  OakBox,
  oakDefaultTheme,
  OakP,
  OakThemeProvider,
} from "@oaknational/oak-components";

import RegistrationAside from "../RegistrationAside/RegistrationAside";

import Component from "./RegistrationLayout";

const meta: Meta<typeof Component> = {
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const RegistrationLayout: Story = {
  args: {
    asideSlot: <RegistrationAside />,
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
