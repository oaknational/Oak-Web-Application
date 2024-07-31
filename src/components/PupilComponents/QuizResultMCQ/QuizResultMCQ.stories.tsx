import type { Meta, StoryObj } from "@storybook/react";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { QuizResultMCQ } from "./QuizResultMCQ";

import { mcqTextAnswers } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";

const meta = {
  component: QuizResultMCQ,
  decorators: [
    (Story) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Story />
      </OakThemeProvider>
    ),
  ],
  parameters: {
    controls: {
      include: [],
    },
  },
} satisfies Meta<typeof QuizResultMCQ>;

export default meta;

type Story = StoryObj<typeof meta>;

/*
 * A component to display the results of a multiple choice quiz in the review section
 *
 */
export const CorrectSingle: Story = {
  render: () => {
    return <QuizResultMCQ {...args} />;
  },
  args: {
    answers: mcqTextAnswers,
    pupilAnswers: 2,
  },
};

export const IncorrectSingle: Story = {
  render: (args) => {
    return <QuizResultMCQ {...args} />;
  },
  args: {
    answers: mcqTextAnswers,
    pupilAnswers: 0,
  },
};

export const MixedMultiple: Story = {
  render: (args) => {
    return <QuizResultMCQ {...args} />;
  },
  args: {
    answers: mcqTextAnswers,
    pupilAnswers: [0, 2],
  },
};

export const IncorrectMultiple: Story = {
  render: (args) => {
    return <QuizResultMCQ {...args} />;
  },
  args: {
    answers: mcqTextAnswers,
    pupilAnswers: [0, 1],
  },
};
