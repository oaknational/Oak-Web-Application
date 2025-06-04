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
  render: () => {
    return (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Component />
      </OakThemeProvider>
    );
  },
};
