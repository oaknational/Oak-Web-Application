import type { Meta, StoryObj } from "@storybook/nextjs";
import {
  OakBox,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";

import { QuizShortQuestion } from "./QuizShortQuestion";

import { MathJaxProvider } from "@/browser-lib/mathjax/MathJaxProvider";
import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";

const shortAnswerQuestion = quizQuestions[5]!;

const meta = {
  component: QuizShortQuestion,
  decorators: [
    (Story) => (
      <MathJaxProvider>
        <OakThemeProvider theme={oakDefaultTheme}>
          <OakBox $background="bg-decorative1-very-subdued" $pa="spacing-16">
            <Story />
          </OakBox>
        </OakThemeProvider>
      </MathJaxProvider>
    ),
  ],
} satisfies Meta<typeof QuizShortQuestion>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    section: "starter-quiz",
    questionData: shortAnswerQuestion,
    questionState: {
      mode: "init",
      grade: 0,
      offerHint: false,
    },
    isReadOnly: false,
    onChange: () => {},
  },
};

export const FeedbackCorrect: Story = {
  args: {
    section: "starter-quiz",
    questionData: shortAnswerQuestion,
    questionState: {
      mode: "feedback",
      grade: 1,
      offerHint: false,
      feedback: "correct",
    },
    isReadOnly: false,
    onChange: () => {},
  },
};

export const FeedbackIncorrect: Story = {
  args: {
    section: "starter-quiz",
    questionData: shortAnswerQuestion,
    questionState: {
      mode: "feedback",
      grade: 0,
      offerHint: false,
      feedback: "incorrect",
    },
    isReadOnly: false,
    onChange: () => {},
  },
};
