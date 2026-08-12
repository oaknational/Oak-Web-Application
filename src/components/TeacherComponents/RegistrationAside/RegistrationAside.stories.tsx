import { Meta, StoryObj } from "@storybook/nextjs";

import Component from "./RegistrationAside";

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
    return <Component />;
  },
};
