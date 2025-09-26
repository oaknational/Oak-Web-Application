import type { Meta, StoryObj } from "@storybook/nextjs";
import {
  OakBox,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";

import { createQuizEngineContext } from "../pupilTestHelpers/createQuizEngineContext";

import { QuizShortAnswer } from "./QuizShortAnswer";

import {
  QuizEngineContext,
  QuizEngineContextType,
} from "@/components/PupilComponents/QuizEngineProvider";
import {
  QuestionFeedbackType,
  QuestionModeType,
} from "@/components/PupilComponents/QuizUtils/questionTypes";
import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";

const meta = {
  component: QuizShortAnswer,
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
  return createQuizEngineContext({
    currentQuestionData: quizQuestions?.find(
      (q) =>
        q.answers?.["short-answer"] && q.answers?.["short-answer"].length > 0,
    ),
    questionState: [
      {
        mode: mode,
        grade: 0,
        feedback: feedback,
        offerHint: false,
      },
    ],
  });
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
  args: {
    onChange: () => {},
  },
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
  args: {
    onChange: () => {},
  },
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
  args: {
    onChange: () => {},
  },
};
