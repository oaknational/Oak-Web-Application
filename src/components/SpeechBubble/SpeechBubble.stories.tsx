import { Meta, StoryObj } from "@storybook/react";

import Component from "./SpeechBubble";

const meta: Meta<typeof Component> = {
  title: "Element/Speech Bubble",
  component: Component,
  argTypes: {},
};
export default meta;
type Story = StoryObj<typeof Component>;

export const BubbleMessage: Story = {
  args: {
    text: "Encourage students to ask 'why' questions, fostering curiosity and critical thinking. Emphasize that no question is silly and every inquiry is an opportunity to learn and promote active learning by incorporating group discussions, hands-on activities",
    label: "Teacher Tip",
  },
};
