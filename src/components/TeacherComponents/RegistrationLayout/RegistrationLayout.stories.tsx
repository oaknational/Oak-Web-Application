import { Meta, StoryObj } from "@storybook/react";
import {
  OakBox,
  oakDefaultTheme,
  OakThemeProvider,
} from "@oaknational/oak-components";

import RegistrationAside from "../RegistrationAside/ResgistrationAside";

import Component from "./RegistrationLayout";

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
    children: (
      <OakBox
        $width="all-spacing-18"
        $height="all-spacing-23"
        $ba="border-solid-m"
      >
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
  },
  render: (args) => {
    return (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Component {...args} />
      </OakThemeProvider>
    );
  },
};
