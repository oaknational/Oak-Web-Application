import { Meta, StoryObj } from "@storybook/react";

import Component from "./LessonMetadata";

const meta: Meta<typeof Component> = {
  title: "LessonMetadata",
  component: Component,
  argTypes: {
    examBoardTitle: {
      control: "radio",
      options: [null, undefined, "Edexcel", "AQA"],
    },
    tierTitle: {
      control: "radio",
      options: [null, undefined, "Foundation", "Higher"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Component>;

export const LessonMetadata: Story = {
  args: {
    yearTitle: "Year 5",
  },
  render: (args) => {
    return <Component {...args} />;
  },
};
