import type { Meta, StoryObj } from "@storybook/react";
import {
  OakBox,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oak-academy/oak-components";

import { QuizShortAnswer } from "./QuizShortAnswer";

import {
  QuizEngineContext,
  QuizEngineContextType,
} from "@/components/PupilJourneyComponents/QuizEngineProvider";
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
const mockQuizEngineContext: QuizEngineContextType = {
  currentQuestionData: quizQuestions?.find(
    (q) =>
      q.answers?.["short-answer"] && q.answers?.["short-answer"].length > 0,
  ),
  currentQuestionIndex: 0,
  questionState: [
    {
      mode: "feedback",
      grade: 0,
      feedback: ["correct", "incorrect", "correct", "correct"],
      offerHint: false,
    },
  ],
  score: 0,
  maxScore: 0,
  isComplete: false,
  updateQuestionMode: () => {},
  handleSubmitMCAnswer: () => {},
  handleNextQuestion: () => {},
};

/*
 * A component to render MCQ questions where there are multiple answers
 * The component updates the state of the quizEngineProvider with the attempted answer
 *
 */
export const Primary: Story = {
  render: (args) => (
    <QuizEngineContext.Provider value={mockQuizEngineContext}>
      <OakBox
        $background={"bg-decorative1-very-subdued"}
        $pa={"inner-padding-m"}
      >
        <QuizShortAnswer {...args} />
      </OakBox>
    </QuizEngineContext.Provider>
  ),
  args: {},
};
