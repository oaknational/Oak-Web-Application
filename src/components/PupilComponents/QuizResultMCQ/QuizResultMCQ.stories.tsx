import type { Meta, StoryObj } from "@storybook/nextjs";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { QuizResultMCQ } from "./QuizResultMCQ";

import {
  mcqTextAnswers,
  mcqImageAnswers,
} from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";
import { MathJaxProvider } from "@/browser-lib/mathjax/MathJaxProvider";

const meta = {
  component: QuizResultMCQ,
  decorators: [
    (Story) => (
      <MathJaxProvider>
        <OakThemeProvider theme={oakDefaultTheme}>
          <Story />
        </OakThemeProvider>
      </MathJaxProvider>
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
    feedback: ["correct", "correct", "correct", "correct"],
    pupilAnswer: [2],
  },
};

export const IncorrectSingle: Story = {
  render: (args) => {
    return <QuizResultMCQ {...args} />;
  },
  args: {
    answers: mcqTextAnswers,
    feedback: ["incorrect", "correct", "correct", "incorrect"],
    pupilAnswer: [0],
  },
};

export const MixedMultiple: Story = {
  render: (args) => {
    return <QuizResultMCQ {...args} />;
  },
  args: {
    answers: mcqTextAnswers,
    feedback: ["incorrect", "correct", "correct", "incorrect"],
    pupilAnswer: [0, 2],
  },
};

export const IncorrectMultiple: Story = {
  render: (args) => {
    return <QuizResultMCQ {...args} />;
  },
  args: {
    answers: mcqTextAnswers,
    feedback: ["incorrect", "incorrect", "incorrect", "incorrect"],
    pupilAnswer: [0, 1],
  },
};

export const CorrectMultiple: Story = {
  render: (args) => {
    return <QuizResultMCQ {...args} />;
  },
  args: {
    answers: mcqTextAnswers,
    feedback: ["correct", "correct", "correct", "correct"],
    pupilAnswer: [2, 3],
  },
};

export const WithImages: Story = {
  render: (args) => {
    return <QuizResultMCQ {...args} />;
  },
  args: {
    answers: mcqImageAnswers,
    feedback: ["incorrect", "incorrect", "correct", "incorrect"],
    pupilAnswer: [2, 3],
  },
};
