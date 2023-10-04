import { Meta, StoryObj } from "@storybook/react";

import Component from "./Accordion";

const meta: Meta<typeof Component> = {
  component: Component,
  title: "Foundations/Accordion",
  argTypes: {
    title: {
      defaultValue: "Lesson in unit",
    },
    toggleClosed: {
      defaultValue: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Accordion: Story = {
  args: {
    title: "Lessons in unit",
    toggleClosed: true,
  },
  render: (args) => (
    <Component {...args}>
      <p>test child content</p>
    </Component>
  ),
};
