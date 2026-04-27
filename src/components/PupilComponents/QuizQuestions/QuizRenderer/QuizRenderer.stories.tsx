import type { Meta, StoryObj } from "@storybook/nextjs";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { QuizRenderer } from "./QuizRenderer";

import { MathJaxProvider } from "@/browser-lib/mathjax/MathJaxProvider";
import {
  mcqTextAnswers,
  quizQuestions,
} from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";

const singleAnswerQuestion = quizQuestions[0]!;
const shortAnswerQuestion = quizQuestions[5]!;
const matchQuestion = quizQuestions[3]!;
const multiAnswerQuestion = {
  ...quizQuestions[0]!,
  questionUid: "QUES-MULTI-RENDERER-STORY",
  answers: {
    "multiple-choice": mcqTextAnswers.map((answer, index) => ({
      ...answer,
      answerIsCorrect: index === 0 || index === 2,
    })),
  },
} as const;

const meta = {
  component: QuizRenderer,
  decorators: [
    (Story) => (
      <MathJaxProvider>
        <OakThemeProvider theme={oakDefaultTheme}>
          <Story />
        </OakThemeProvider>
      </MathJaxProvider>
    ),
  ],
} satisfies Meta<typeof QuizRenderer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SingleAnswerQuestion: Story = {
  args: {
    formId: "single-answer-form",
    currentQuestionData: singleAnswerQuestion,
    currentQuestionIndex: 1,
    currentQuestionState: {
      mode: "init",
      grade: 0,
      offerHint: false,
    },
    section: "starter-quiz",
    isReadOnly: false,
    onChange: () => {},
    onQuestionModeChange: () => {},
    onSubmit: () => {},
  },
};

export const MultipleAnswerQuestion: Story = {
  args: {
    formId: "multi-answer-form",
    currentQuestionData: multiAnswerQuestion,
    currentQuestionIndex: 1,
    currentQuestionState: {
      mode: "feedback",
      grade: 0,
      offerHint: false,
      feedback: ["correct", "incorrect", "correct", "incorrect"],
    },
    section: "starter-quiz",
    isReadOnly: false,
    onChange: () => {},
    onQuestionModeChange: () => {},
    onSubmit: () => {},
  },
};

export const ShortAnswerFeedback: Story = {
  args: {
    formId: "short-answer-form",
    currentQuestionData: shortAnswerQuestion,
    currentQuestionIndex: 2,
    currentQuestionState: {
      mode: "feedback",
      grade: 1,
      offerHint: false,
      feedback: "correct",
    },
    section: "exit-quiz",
    isReadOnly: false,
    onChange: () => {},
    onQuestionModeChange: () => {},
    onSubmit: () => {},
  },
};

export const MatchQuestion: Story = {
  args: {
    formId: "match-question-form",
    currentQuestionData: matchQuestion,
    currentQuestionIndex: 3,
    currentQuestionState: {
      mode: "init",
      grade: 0,
      offerHint: false,
    },
    section: "starter-quiz",
    isReadOnly: false,
    onChange: () => {},
    onQuestionModeChange: () => {},
    onSubmit: () => {},
  },
};
