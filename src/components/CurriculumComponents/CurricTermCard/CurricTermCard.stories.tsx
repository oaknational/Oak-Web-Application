import { Meta, StoryObj } from "@storybook/nextjs";

import { CurricTermCard as Component } from ".";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {
    title: {
      defaultValue: "Year 1",
    },
    coveredNumberOfLessons: {
      type: "number",
      defaultValue: 25,
    },
    totalNumberOfLessons: {
      type: "number",
      defaultValue: 30,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    title: "Year 1",
    coveredNumberOfLessons: 25,
    totalNumberOfLessons: 30,
    children: "<<CONTENT>>",
  },
  render: (args) => <Component {...args} />,
};
