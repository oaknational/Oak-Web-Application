import { Meta, StoryObj } from "@storybook/react";

import Component from "./ResgistrationAside";

const meta: Meta<typeof Component> = {
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const RegistrationAside: Story = {
  render: () => {
    return <Component />;
  },
};
