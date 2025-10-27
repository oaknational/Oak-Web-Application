import { Meta, StoryObj } from "@storybook/nextjs";
import { action } from "storybook/actions";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import Component from ".";

const meta: Meta<typeof Component> = {
  component: Component,
  decorators: [
    (Story) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Story />
      </OakThemeProvider>
    ),
  ],
  argTypes: {
    title: {
      defaultValue: "Thanks for downloading",
    },
    message: {
      defaultValue:
        "We hope you find the resources useful. Click the question mark in the bottom-right corner to share your feedback.",
    },
    buttonProps: {
      defaultValue: {
        label: "Back to downloads",
        onClick: action("on-click"),
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    title: "Thanks for downloading",
    message:
      "We hope you find the resources useful. Click the question mark in the bottom-right corner to share your feedback.",
    buttonProps: {
      label: "Back to downloads",
      onClick: action("on-click"),
    },
  },
  render: (args) => <Component {...args} />,
};
