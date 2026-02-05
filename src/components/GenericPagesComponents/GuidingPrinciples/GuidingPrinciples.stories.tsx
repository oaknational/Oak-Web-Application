import { Meta, StoryObj } from "@storybook/nextjs";
import {
  oakDefaultTheme,
  OakThemeProvider,
  oakUiRoleTokens,
} from "@oaknational/oak-components";

import { GuidingPrinciples as Component } from ".";

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ["autodocs"],
  title: "Components/GenericPagesComponents/GuidingPrinciples",
  argTypes: {
    accentColor: {
      options: oakUiRoleTokens,
    },
    $background: {
      options: oakUiRoleTokens,
    },
  },
  decorators: [
    (Story) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Story />
      </OakThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    $background: "bg-decorative1-subdued",
    accentColor: "border-decorative1-stronger",
  },
  render: (args) => <Component {...args} />,
};
