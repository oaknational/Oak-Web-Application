import { Meta, StoryObj } from "@storybook/react";

import Component from ".";

const meta: Meta<typeof Component> = {
  title: "Element/Subject icon",
  component: Component,
  argTypes: {},
};
export default meta;
type Story = StoryObj<typeof Component>;

export const SubjectIcon: Story = {
  args: {
    subjectSlug: "maths",
  },
};
