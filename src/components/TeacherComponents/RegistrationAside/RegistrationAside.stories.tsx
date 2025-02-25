import { Meta, StoryObj } from "@storybook/react";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import Component from "./ResgistrationAside";

const meta: Meta<typeof Component> = {
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const RegistrationAside: Story = {
  args: {
    useNew: false,
  },
  render: (args) => {
    return (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Component {...args} />
      </OakThemeProvider>
    );
  },
};
export const NewRegistrationAside: Story = {
  args: {
    useNew: true,
  },
  render: (args) => {
    return (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Component {...args} />
      </OakThemeProvider>
    );
  },
};
