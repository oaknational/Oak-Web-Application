import { Meta, StoryObj } from "@storybook/react";

import Component from ".";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {},
};
export default meta;
type Story = StoryObj<typeof Component>;

export const SubjectIconBrushBorders: Story = {
  args: {
    isLegacyLesson: true,
    subjectSlug: "maths",
    color: "lavender",
  },
};
