import type { Meta, StoryObj } from "@storybook/nextjs";

import { QuizResultShortAnswer } from "./QuizResultShortAnswer";

const meta = {
  title: "Components/PupilComponents/QuizQuestions/QuizResultShortAnswer",
  component: QuizResultShortAnswer,
  decorators: [(Story) => <Story />],
  parameters: {
    controls: {
      include: [],
    },
  },
} satisfies Meta<typeof QuizResultShortAnswer>;

export default meta;

type Story = StoryObj<typeof meta>;

/*
 * A component to display the results of a short answer quiz in the review section
 *
 */
export const Correct: Story = {
  render: (args) => {
    return <QuizResultShortAnswer {...args} />;
  },
  args: {
    feedback: "correct",
    pupilAnswer: "This is the correct answer",
  },
};

export const Incorrect: Story = {
  render: (args) => {
    return <QuizResultShortAnswer {...args} />;
  },
  args: {
    feedback: "incorrect",
    pupilAnswer: "This is the incorrect answer",
  },
};
