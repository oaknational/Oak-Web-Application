import type { Meta, StoryObj } from "@storybook/nextjs";
import {
  OakBox,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";

import {
  LessonEngineProvider,
  allLessonReviewSections,
} from "../LessonEngineProvider";
import { createQuizEngineContext } from "../pupilTestHelpers/createQuizEngineContext";

import { QuizMCQMultiAnswer } from "./QuizMCQMultiAnswer";

import {
  QuizEngineContext,
  QuizEngineContextType,
  QuizEngineProvider,
} from "@/components/PupilComponents/QuizEngineProvider";
import {
  quizQuestions,
  mcqImageAnswers,
} from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";

const meta = {
  component: QuizMCQMultiAnswer,
  decorators: [
    (Story) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineProvider
          initialLessonReviewSections={allLessonReviewSections}
          initialSection="overview"
        >
          <Story />
        </LessonEngineProvider>
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
const mockQuizEngineContext: NonNullable<QuizEngineContextType> =
  createQuizEngineContext({
    currentQuestionData: quizQuestions?.[0],
    questionState: [
      {
        mode: "feedback",
        grade: 0,
        feedback: ["correct", "incorrect", "correct", "correct"],
        offerHint: false,
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
    onChange: () => {},
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
    onChange: () => {},
  },
};

export const WithImagesNoFeedback: Story = {
  render: (args) => {
    const contextNoFeedback = { ...mockQuizEngineContext };
    contextNoFeedback.questionState = [
      { mode: "input", grade: 0, feedback: [], offerHint: false },
    ];
    if (contextNoFeedback.currentQuestionData?.answers) {
      contextNoFeedback.currentQuestionData.answers["multiple-choice"] =
        mcqMultiImageAnswers;
    }

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
    onChange: () => {},
  },
};

export const WithImagesFeedback: Story = {
  render: (args) => {
    const contextFeedback = { ...mockQuizEngineContext };
    contextFeedback.questionState = [
      {
        mode: "feedback",
        grade: 0,
        feedback: ["correct", "incorrect", "correct", "incorrect"],
        offerHint: false,
      },
    ];
    if (contextFeedback.currentQuestionData?.answers) {
      contextFeedback.currentQuestionData.answers["multiple-choice"] =
        mcqMultiImageAnswers;
    }

    return (
      <QuizEngineContext.Provider value={contextFeedback}>
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
    onChange: () => {},
  },
};
