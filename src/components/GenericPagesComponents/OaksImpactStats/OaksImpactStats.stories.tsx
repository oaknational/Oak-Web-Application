import { Meta, StoryObj } from "@storybook/nextjs";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import { fixtureData } from "./OaksImpactStats.fixtures";

import { OaksImpactStats as Component } from ".";

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ["autodocs"],
  title: "Components/GenericPagesComponents/OaksImpactStats",
  argTypes: {},
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
  args: fixtureData,
  render: (args) => <Component {...args} />,
};
