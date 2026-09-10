import { Meta, StoryObj } from "@storybook/nextjs";

import { fixtureData } from "./OaksImpactStats.fixtures";

import { OaksImpactStats as Component } from ".";

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ["autodocs"],
  title: "Components/GenericPagesComponents/OaksImpactStats",
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: fixtureData,
  render: (args) => <Component {...args} />,
};
