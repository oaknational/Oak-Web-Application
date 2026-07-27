import type { Meta, StoryObj } from "@storybook/nextjs";
import { OakBox } from "@oaknational/oak-components";

import { QuizMultiQuestion } from "./QuizMultiQuestion";

import { MathJaxProvider } from "@/browser-lib/mathjax/MathJaxProvider";
import {
  mcqTextAnswers,
  quizQuestions,
} from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";

const multiAnswerQuestion = {
  ...quizQuestions[0]!,
  questionUid: "QUES-MULTI-ANSWER-STORY",
  answers: {
    "multiple-choice": mcqTextAnswers.map((answer, index) => ({
      ...answer,
      answerIsCorrect: index === 0 || index === 2,
    })),
  },
} as const;

const meta = {
  component: QuizMultiQuestion,
  decorators: [
    (Story) => (
      <MathJaxProvider>
        <OakBox $background="bg-decorative1-very-subdued" $pa="spacing-16">
          <Story />
        </OakBox>
      </MathJaxProvider>
    ),
  ],
} satisfies Meta<typeof QuizMultiQuestion>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    section: "starter-quiz",
    questionData: multiAnswerQuestion,
    questionState: {
      mode: "init",
      grade: 0,
      offerHint: false,
    },
    isReadOnly: false,
    onChange: () => {},
  },
};

export const Feedback: Story = {
  args: {
    section: "starter-quiz",
    questionData: multiAnswerQuestion,
    questionState: {
      mode: "feedback",
      grade: 0,
      offerHint: false,
      feedback: ["correct", "incorrect", "correct", "incorrect"],
    },
    isReadOnly: false,
    onChange: () => {},
  },
};
