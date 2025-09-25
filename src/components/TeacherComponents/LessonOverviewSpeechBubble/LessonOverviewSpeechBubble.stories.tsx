import { Meta, StoryObj } from "@storybook/nextjs";

import Component from "./LessonOverviewSpeechBubble";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {},
};
export default meta;
type Story = StoryObj<typeof Component>;

export const LessonOverviewSpeechBubble: Story = {
  args: {
    text: "Encourage students to ask 'why' questions, fostering curiosity and critical thinking. Emphasize that no question is silly and every inquiry is an opportunity to learn and promote active learning by incorporating group discussions, hands-on activities",
    label: "Teacher Tip",
  },
};
