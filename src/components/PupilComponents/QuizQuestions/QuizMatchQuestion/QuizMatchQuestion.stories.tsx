import type { Meta, StoryObj } from "@storybook/nextjs";
import { OakBox } from "@oaknational/oak-components";

import { QuizMatchQuestion } from "./QuizMatchQuestion";

import { MathJaxProvider } from "@/browser-lib/mathjax/MathJaxProvider";
import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";

const matchQuestion = quizQuestions[3]!;

const meta = {
  component: QuizMatchQuestion,
  decorators: [
    (Story) => (
      <MathJaxProvider>
        <OakBox $background="bg-decorative1-very-subdued" $pa="spacing-16">
          <Story />
        </OakBox>
      </MathJaxProvider>
    ),
  ],
} satisfies Meta<typeof QuizMatchQuestion>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    section: "starter-quiz",
    questionData: matchQuestion,
    questionState: {
      mode: "init",
      grade: 0,
      offerHint: false,
    },
    isReadOnly: false,
    onQuestionModeChange: () => {},
  },
};

export const ReadOnlyExitQuiz: Story = {
  args: {
    section: "exit-quiz",
    questionData: matchQuestion,
    questionState: {
      mode: "init",
      grade: 0,
      offerHint: false,
    },
    isReadOnly: true,
    onQuestionModeChange: () => {},
  },
};
