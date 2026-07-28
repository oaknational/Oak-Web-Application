import { Meta, StoryObj } from "@storybook/nextjs";

import Component from "./CurricUnitDetailsAccordion";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {
    title: {
      defaultValue: "Lesson in unit",
    },
    lastAccordion: {
      defaultValue: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Component>;

export const CurriculumUnitDetailsAccordion: Story = {
  args: {
    title: "Lessons in unit",
  },
  render: (args) => (
    <Component {...args}>
      <p>test child content</p>
    </Component>
  ),
};
