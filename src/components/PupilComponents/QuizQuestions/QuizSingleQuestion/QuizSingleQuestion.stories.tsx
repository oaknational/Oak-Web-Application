import type { Meta, StoryObj } from "@storybook/nextjs";
import {
  OakBox,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";

import { QuizSingleQuestion } from "./QuizSingleQuestion";

import { MathJaxProvider } from "@/browser-lib/mathjax/MathJaxProvider";
import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";

const singleAnswerQuestion = quizQuestions[0]!;
const imageAnswerQuestion = quizQuestions[2]!;

const meta = {
  component: QuizSingleQuestion,
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
} satisfies Meta<typeof QuizSingleQuestion>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    section: "starter-quiz",
    questionData: singleAnswerQuestion,
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
    questionData: singleAnswerQuestion,
    questionState: {
      mode: "feedback",
      grade: 1,
      offerHint: false,
      feedback: ["incorrect", "incorrect", "correct", "incorrect"],
    },
    isReadOnly: false,
    onChange: () => {},
  },
};

export const WithImages: Story = {
  args: {
    section: "starter-quiz",
    questionData: imageAnswerQuestion,
    questionState: {
      mode: "init",
      grade: 0,
      offerHint: false,
    },
    isReadOnly: false,
    onChange: () => {},
  },
};
