import type { Meta, StoryObj } from "@storybook/nextjs";

import { QuizCorrectAnswers } from "./QuizCorrectAnswers";

import { MathJaxProvider } from "@/browser-lib/mathjax/MathJaxProvider";

const meta = {
  component: QuizCorrectAnswers,
  decorators: [
    (Story) => (
      <MathJaxProvider>
        <Story />
      </MathJaxProvider>
    ),
  ],
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
