import type { Meta, StoryObj } from "@storybook/react";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { QuizQuestionStem } from "./QuizQuestionStem";

import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";

const meta = {
  component: QuizQuestionStem,
  decorators: [
    (Story) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Story />
      </OakThemeProvider>
    ),
  ],

  argTypes: {},
} satisfies Meta<typeof QuizQuestionStem>;

export default meta;

type Story = StoryObj<typeof meta>;

const starterQuiz = quizQuestions;
const mcqText = starterQuiz ? starterQuiz[0] : null;
const mcqStemImage = starterQuiz ? starterQuiz[1] : null;

/*
 * This is the view users will see on encountering an expired lesson
 *
 */

export const Default: Story = {
  render: (args) => {
    return <QuizQuestionStem {...args} />;
  },
  args: {
    questionStem: mcqText?.questionStem || [],
    index: 0,
  },
};

export const Text: Story = {
  render: (args) => {
    return <QuizQuestionStem {...args} />;
  },
  args: {
    questionStem: mcqText?.questionStem || [],
    index: 0,
  },
};

export const Image: Story = {
  render: (args) => {
    return <QuizQuestionStem {...args} />;
  },
  args: {
    questionStem: mcqStemImage?.questionStem || [],
    index: 0,
  },
};
