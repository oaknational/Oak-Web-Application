import type { Meta, StoryObj } from "@storybook/react";
import {
  OakBox,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";

import { QuizMCQSingleAnswer } from "./QuizMCQSingleAnswer";

import {
  QuestionFeedbackType,
  QuizEngineContext,
  QuizEngineContextType,
} from "@/components/PupilComponents/QuizEngineProvider";
import {
  quizQuestions,
  mcqImageAnswers,
} from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";

const meta = {
  component: QuizMCQSingleAnswer,
  tags: ["autodocs"],
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
}): NonNullable<QuizEngineContextType> => ({
  currentQuestionData: quizQuestions?.[0],
  currentQuestionIndex: 0,
  numInteractiveQuestions: 0,
  currentQuestionDisplayIndex: 0,
  questionState: [
    {
      mode: params?.mode ?? "init",
      grade: 0,
      offerHint: false,
      feedback: params?.feedback,
    },
  ],
  score: 0,
  numQuestions: 0,
  updateQuestionMode: () => {},
  handleSubmitMCAnswer: () => {},
  handleSubmitShortAnswer: () => {},
  handleNextQuestion: () => {},
});

const mcqMultiImageAnswers = [...mcqImageAnswers];
if (mcqMultiImageAnswers[0]) {
  mcqMultiImageAnswers[0].answer_is_correct = true;
}
if (mcqMultiImageAnswers[2]) {
  mcqMultiImageAnswers[2].answer_is_correct = true;
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
  args: {},
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
  args: {},
};
