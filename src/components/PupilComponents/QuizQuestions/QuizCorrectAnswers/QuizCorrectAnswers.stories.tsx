import type { Meta, StoryObj } from "@storybook/nextjs";

import { QuizCorrectAnswers } from "./QuizCorrectAnswers";

const meta = {
  component: QuizCorrectAnswers,
} satisfies Meta<typeof QuizCorrectAnswers>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SingleCorrectAnswer: Story = {
  args: {
    questionState: {
      mode: "feedback",
      grade: 0,
      offerHint: false,
      correctAnswer: "earth",
    },
  },
};

export const MultipleCorrectAnswers: Story = {
  args: {
    questionState: {
      mode: "feedback",
      grade: 0,
      offerHint: false,
      correctAnswer: ["earth", "wind", "fire"],
    },
  },
};

export const NoCorrectAnswer: Story = {
  args: {
    questionState: {
      mode: "feedback",
      grade: 0,
      offerHint: false,
    },
  },
};
