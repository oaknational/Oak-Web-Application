import type { Meta, StoryObj } from "@storybook/nextjs";
import {
  OakBox,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";

import { createQuizEngineContext } from "../pupilTestHelpers/createQuizEngineContext";

import { QuizMCQSingleAnswer } from "./QuizMCQSingleAnswer";

import {
  QuizEngineContext,
  QuizEngineContextType,
} from "@/components/PupilComponents/QuizEngineProvider";
import { QuestionFeedbackType } from "@/components/PupilComponents/QuizUtils/questionTypes";
import {
  quizQuestions,
  mcqImageAnswers,
} from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";

const meta = {
  component: QuizMCQSingleAnswer,
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
} satisfies Meta<typeof QuizMCQSingleAnswer>;

export default meta;

type Story = StoryObj<typeof meta>;

// mock the QuizEngineContext
const getContext = (params?: {
  feedback?: QuestionFeedbackType[];
  mode?: "init" | "feedback";
}): NonNullable<QuizEngineContextType> =>
  createQuizEngineContext({
    currentQuestionData: quizQuestions?.[0],
    questionState: [
      {
        mode: params?.mode ?? "init",
        grade: 0,
        offerHint: false,
        feedback: params?.feedback,
      },
    ],
  });

const mcqMultiImageAnswers = [...mcqImageAnswers];
if (mcqMultiImageAnswers[0]) {
  mcqMultiImageAnswers[0].answerIsCorrect = true;
}
if (mcqMultiImageAnswers[2]) {
  mcqMultiImageAnswers[2].answerIsCorrect = true;
}

/*
 * A component to render MCQ questions where there is a single answer
 *
 */
export const Default: Story = {
  render: (args) => {
    const context = getContext();
    return (
      <QuizEngineContext.Provider value={context}>
        <OakBox
          $background={"bg-decorative1-very-subdued"}
          $pa={"inner-padding-m"}
        >
          <QuizMCQSingleAnswer {...args} />
        </OakBox>
      </QuizEngineContext.Provider>
    );
  },
  args: {
    onChange: () => {},
  },
};

export const Feedback: Story = {
  render: (args) => {
    const context = getContext({
      feedback: ["correct", "incorrect", "incorrect", "incorrect"],
      mode: "feedback",
    });
    return (
      <QuizEngineContext.Provider value={context}>
        <OakBox
          $background={"bg-decorative1-very-subdued"}
          $pa={"inner-padding-m"}
        >
          <QuizMCQSingleAnswer {...args} />
        </OakBox>
      </QuizEngineContext.Provider>
    );
  },
  args: {
    onChange: () => {},
  },
};
