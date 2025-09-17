import type { Meta, StoryObj } from "@storybook/react";

import ResourcesAccordion from "./ResourcesAccordion";

import Component from ".";

const meta: Meta<typeof Component> = {
  component: Component,
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    cardGroup: <div>Hello</div>,
  },
  render: (args) => {
    return <ResourcesAccordion {...args} />;
  },
};
