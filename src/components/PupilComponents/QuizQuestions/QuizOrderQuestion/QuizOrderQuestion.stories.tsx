import type { Meta, StoryObj } from "@storybook/nextjs";
import { OakBox } from "@oaknational/oak-components";

import { QuizOrderQuestion } from "./QuizOrderQuestion";

import { MathJaxProvider } from "@/browser-lib/mathjax/MathJaxProvider";
import type { QuizQuestion } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";

const orderQuestion: QuizQuestion = {
  questionId: 1,
  questionUid: "QUES-ORDER-STORY",
  questionType: "order",
  order: 1,
  active: false,
  _state: "published",
  questionStem: [
    {
      text: "Put the steps in order.",
      type: "text",
    },
  ],
  answers: {
    order: [
      {
        answer: [
          {
            text: "First step",
            type: "text",
          },
        ],
        correctOrder: 1,
      },
    ],
  },
  feedback: "Feedback",
};

const meta = {
  component: QuizOrderQuestion,
  decorators: [
    (Story) => (
      <MathJaxProvider>
        <OakBox $background="bg-decorative1-very-subdued" $pa="spacing-16">
          <Story />
        </OakBox>
      </MathJaxProvider>
    ),
  ],
} satisfies Meta<typeof QuizOrderQuestion>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    section: "starter-quiz",
    questionData: orderQuestion,
    questionState: {
      mode: "init",
      grade: 0,
      offerHint: false,
    },
    isReadOnly: false,
    onChange: () => {},
    onQuestionModeChange: () => {},
  },
};

export const Feedback: Story = {
  args: {
    section: "starter-quiz",
    questionData: orderQuestion,
    questionState: {
      mode: "feedback",
      grade: 1,
      offerHint: false,
      feedback: ["correct"],
    },
    isReadOnly: false,
    onChange: () => {},
    onQuestionModeChange: () => {},
  },
};
