import { Meta, StoryObj } from "@storybook/react";

import { TeachWithOakHeader as Component } from "./TeachWithOakHeader";

const meta = {
  component: Component,
  tags: ["autodocs"],
  title: "Components/TeacherComponents/TeachWithOakHeader",
  argTypes: {},
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    href: "/",
  },
  render: (args) => <Component {...args} />,
};
