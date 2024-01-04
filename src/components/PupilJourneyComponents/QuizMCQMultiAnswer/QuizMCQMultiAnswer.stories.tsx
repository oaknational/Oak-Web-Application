import type { Meta, StoryObj } from "@storybook/react";
import {
  OakBox,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oak-academy/oak-components";

import { QuizMCQMultiAnswer } from "./QuizMCQMultiAnswer";

import {
  QuizEngineContext,
  QuizEngineContextType,
  QuizEngineProvider,
} from "@/components/PupilJourneyComponents/QuizEngineProvider";
import {
  mcqTextAnswers,
  quizQuestions,
} from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";

const meta = {
  component: QuizMCQMultiAnswer,
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
} satisfies Meta<typeof QuizMCQMultiAnswer>;

export default meta;

type Story = StoryObj<typeof meta>;

// mock the QuizEngineContext
const mockQuizEngineContext: QuizEngineContextType = {
  currentQuestionData: {
    questionUid: "test",
    questionId: 0,
    questionType: "multiple-choice",
    questionStem: [
      {
        type: "text",
        text: "Test question",
      },
    ],
    answers: { "multiple-choice": mcqTextAnswers },
    feedback: "",
    hint: "",
    active: true,
  },
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
    <QuizEngineProvider questionsArray={quizQuestions ?? []}>
      <OakBox
        $background={"bg-decorative1-very-subdued"}
        $pa={"inner-padding-m"}
      >
        <QuizMCQMultiAnswer {...args} />
      </OakBox>
    </QuizEngineProvider>
  ),
  args: {
    questionUid: "123",
    answers: quizQuestions?.[0]?.answers?.["multiple-choice"] || [],
  },
};

export const FeedbackMode: Story = {
  render: (args) => (
    <QuizEngineContext.Provider value={mockQuizEngineContext}>
      <OakBox
        $background={"bg-decorative1-very-subdued"}
        $pa={"inner-padding-m"}
      >
        <QuizMCQMultiAnswer {...args} />
      </OakBox>
    </QuizEngineContext.Provider>
  ),
  args: {
    questionUid: "123",
    answers: quizQuestions?.[0]?.answers?.["multiple-choice"] || [],
  },
};

export const WithImagesNoFeedback: Story = {
  render: (args) => {
    const contextNoFeedback = { ...mockQuizEngineContext };
    contextNoFeedback.questionState = [
      { mode: "input", grade: 0, feedback: [], offerHint: false },
    ];

    return (
      <QuizEngineContext.Provider value={contextNoFeedback}>
        <OakBox
          $background={"bg-decorative1-very-subdued"}
          $pa={"inner-padding-m"}
        >
          <QuizMCQMultiAnswer {...args} />
        </OakBox>
      </QuizEngineContext.Provider>
    );
  },
  args: {
    questionUid: "123",
    answers: quizQuestions?.[2]?.answers?.["multiple-choice"] || [],
  },
};

export const WithImagesFeedback: Story = {
  render: (args) => {
    return (
      <QuizEngineContext.Provider value={mockQuizEngineContext}>
        <OakBox
          $background={"bg-decorative1-very-subdued"}
          $pa={"inner-padding-m"}
        >
          <QuizMCQMultiAnswer {...args} />
        </OakBox>
      </QuizEngineContext.Provider>
    );
  },
  args: {
    questionUid: "123",
    answers: quizQuestions?.[2]?.answers?.["multiple-choice"] || [],
  },
};
