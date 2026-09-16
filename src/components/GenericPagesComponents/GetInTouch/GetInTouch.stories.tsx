import { Meta, StoryObj } from "@storybook/nextjs";

import { GetInTouch as Component } from ".";

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ["autodocs"],
  title: "Components/GenericPagesComponents/GetInTouch",
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    name: "John Doe",
    role: "Teacher",
    schoolOrMat: "Springfield High School",
    imageUrl: `https://res.cloudinary.com/oak-web-application/image/upload/v1763393163/icons/chatting-illustration_l52zaf.svg`,
    imageAlt: "Example image",
  },
  render: (args) => <Component {...args} />,
};
