import type { Meta, StoryObj } from "@storybook/react";
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
    feedback: [null, null, "correct", null],
  },
};

export const IncorrectSingle: Story = {
  render: (args) => {
    return <QuizResultMCQ {...args} />;
  },
  args: {
    answers: mcqTextAnswers,
    feedback: ["incorrect", null, null, null],
  },
};

export const MixedMultiple: Story = {
  render: (args) => {
    return <QuizResultMCQ {...args} />;
  },
  args: {
    answers: mcqTextAnswers,
    feedback: ["incorrect", null, "correct", null],
  },
};

export const IncorrectMultiple: Story = {
  render: (args) => {
    return <QuizResultMCQ {...args} />;
  },
  args: {
    answers: mcqTextAnswers,
    feedback: ["incorrect", "incorrect", null, null],
  },
};

export const CorrectMultiple: Story = {
  render: (args) => {
    return <QuizResultMCQ {...args} />;
  },
  args: {
    answers: mcqTextAnswers,
    feedback: [null, null, "correct", "correct"],
  },
};

export const WithImages: Story = {
  render: (args) => {
    return <QuizResultMCQ {...args} />;
  },
  args: {
    answers: mcqImageAnswers,
    feedback: [null, "incorrect", "correct", null],
  },
};
