import { Meta, StoryObj } from "@storybook/react";

import Component from ".";

const meta: Meta<typeof Component> = {
  title: "Element/Subject icon brush borders",
  component: Component,
  argTypes: {},
};
export default meta;
type Story = StoryObj<typeof Component>;

export const SubjectIconBrushBorders: Story = {
  args: {
    isNew: false,
    subjectSlug: "maths",
    color: "lavender",
  },
};
