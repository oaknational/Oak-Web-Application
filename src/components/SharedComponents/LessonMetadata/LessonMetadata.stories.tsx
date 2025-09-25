import { Meta, StoryObj } from "@storybook/nextjs";

import Component from "./LessonMetadata";

const meta: Meta<typeof Component> = {
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
