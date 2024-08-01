import type { Meta, StoryObj } from "@storybook/react";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { QuizResultMCQ } from "./QuizResultMCQ";

import {
  mcqTextAnswers,
  mcqImageAnswers,
} from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";
import { MCAnswer } from "@/node-lib/curriculum-api-2023/shared.schema";

const mcqMulitpleCorrectAnswers = [
  mcqTextAnswers[0],
  mcqTextAnswers[1],
  mcqTextAnswers[2],
  { ...mcqTextAnswers[3], answerIsCorrect: true },
] as MCAnswer[]; // for some reason TS gets upset about the possibility of undefined inside the answer property even thought that is on the MCAnswer type

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
  render: (args) => {
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

export const CorrectMultiple: Story = {
  render: (args) => {
    return <QuizResultMCQ {...args} />;
  },
  args: {
    answers: mcqMulitpleCorrectAnswers,
    pupilAnswers: [2, 3],
  },
};

export const WithImages: Story = {
  render: (args) => {
    return <QuizResultMCQ {...args} />;
  },
  args: {
    answers: mcqImageAnswers,
    pupilAnswers: [1, 2],
  },
};
