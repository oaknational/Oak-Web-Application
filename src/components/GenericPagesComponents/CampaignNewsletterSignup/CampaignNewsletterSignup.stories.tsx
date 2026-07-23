import { Meta, StoryObj } from "@storybook/nextjs";

import Component from "./CampaignNewsletterSignup";

const meta: Meta<typeof Component> = {
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Default: Story = {
  render: (args) => <Component {...args} />,
  args: {},
};
