import type { Meta, StoryObj } from "@storybook/react";
import {
  OakBox,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oak-academy/oak-components";

import { QuizShortAnswer } from "./QuizShortAnswer";

import {
  QuestionFeedbackType,
  QuestionModeType,
  QuizEngineContext,
  QuizEngineContextType,
} from "@/components/PupilComponents/QuizEngineProvider";
import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";

const meta = {
  component: QuizShortAnswer,
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
} satisfies Meta<typeof QuizShortAnswer>;

export default meta;

type Story = StoryObj<typeof meta>;

// mock the QuizEngineContext
const getContext = (
  params: {
    feedback?: QuestionFeedbackType;
    mode?: QuestionModeType;
  } = {},
): QuizEngineContextType => {
  const { mode = "init", feedback } = params;
  return {
    currentQuestionData: quizQuestions?.find(
      (q) =>
        q.answers?.["short-answer"] && q.answers?.["short-answer"].length > 0,
    ),
    currentQuestionIndex: 0,
    questionState: [
      {
        mode: mode,
        grade: 0,
        feedback: feedback,
        offerHint: false,
      },
    ],
    score: 0,
    numQuestions: 0,
    updateQuestionMode: () => {},
    handleSubmitMCAnswer: () => {},
    handleSubmitShortAnswer: () => {},
    handleNextQuestion: () => {},
  };
};

/*
 * A component to render MCQ questions where there are multiple answers
 * The component updates the state of the quizEngineProvider with the attempted answer
 *
 */
export const Init: Story = {
  render: (args) => {
    const mock = getContext();
    return (
      <QuizEngineContext.Provider value={mock}>
        <OakBox
          $background={"bg-decorative1-very-subdued"}
          $pa={"inner-padding-m"}
        >
          <QuizShortAnswer {...args} />
        </OakBox>
      </QuizEngineContext.Provider>
    );
  },
  args: {},
};

export const FeedbackCorrect: Story = {
  render: (args) => {
    const mock = getContext({ mode: "feedback", feedback: "correct" });
    return (
      <QuizEngineContext.Provider value={mock}>
        <OakBox
          $background={"bg-decorative1-very-subdued"}
          $pa={"inner-padding-m"}
        >
          <QuizShortAnswer {...args} />
        </OakBox>
      </QuizEngineContext.Provider>
    );
  },
  args: {},
};

export const FeedbackIncorrect: Story = {
  render: (args) => {
    const mock = getContext({ mode: "feedback", feedback: "incorrect" });
    return (
      <QuizEngineContext.Provider value={mock}>
        <OakBox
          $background={"bg-decorative1-very-subdued"}
          $pa={"inner-padding-m"}
        >
          <QuizShortAnswer {...args} />
        </OakBox>
      </QuizEngineContext.Provider>
    );
  },
  args: {},
};
