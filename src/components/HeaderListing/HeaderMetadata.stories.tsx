import { Meta, StoryObj } from "@storybook/react";

import Component from "./HeaderMetadata";

const meta: Meta<typeof Component> = {
  title: "Headers & Footers/HeaderMetadata",
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

export const HeaderLesson: Story = {
  args: {
    yearTitle: "Year 5",
  },
  render: (args) => {
    return <Component {...args} />;
  },
};
