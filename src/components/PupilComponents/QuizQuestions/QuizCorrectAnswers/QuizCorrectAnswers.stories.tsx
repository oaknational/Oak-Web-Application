import type { Meta, StoryObj } from "@storybook/nextjs";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { QuizCorrectAnswers } from "./QuizCorrectAnswers";

const meta = {
  component: QuizCorrectAnswers,
  decorators: [
    (Story) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Story />
      </OakThemeProvider>
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
