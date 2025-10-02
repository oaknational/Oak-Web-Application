import { Meta, StoryObj } from "@storybook/nextjs";

import Component from ".";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {},
};
export default meta;
type Story = StoryObj<typeof Component>;

export const SubjectIconBrushBorders: Story = {
  args: {
    isNew: true,
    subjectSlug: "maths",
    color: "lavender",
  },
};
