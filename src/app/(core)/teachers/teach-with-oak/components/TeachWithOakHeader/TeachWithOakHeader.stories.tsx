import { Meta, StoryObj } from "@storybook/react";

import { TeachWithOakHeader as Component } from "./TeachWithOakHeader";

import TeacherBrowseAnalyticsDecorator from "@/storybook-decorators/TeacherBrowseAnalyticsDecorator";

const meta = {
  component: Component,
  tags: ["autodocs"],
  title: "App/TeachWithOak/TeachWithOakHeader",
  argTypes: {},
  decorators: [TeacherBrowseAnalyticsDecorator],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    href: "/",
  },
  render: (args) => <Component {...args} />,
};
