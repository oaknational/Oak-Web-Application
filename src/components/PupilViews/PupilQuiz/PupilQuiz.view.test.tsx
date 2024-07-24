import React from "react";
import "@testing-library/jest-dom";
import {
  OakThemeProvider,
  OakTooltipProps,
  oakDefaultTheme,
} from "@oaknational/oak-components";
import { act, fireEvent } from "@testing-library/react";
import { ValueOf } from "next/dist/shared/lib/constants";
import { useFeatureFlagVariantKey } from "posthog-js/react";

import { PupilViewsQuiz } from "./PupilQuiz.view";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import {
  matchAnswers,
  mcqCorrectAnswer,
  mcqIncorrectAnswer,
  mcqTextAnswers,
  orderAnswers,
  quizQuestions,
  shortAnswers,
} from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";
import {
  LessonEngineContext,
  LessonSection,
} from "@/components/PupilComponents/LessonEngineProvider";
import { createLessonEngineContext } from "@/components/PupilComponents/pupilTestHelpers/createLessonEngineContext";
import { QuizQuestionAnswers } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import "@/__tests__/__helpers__/IntersectionObserverMock";
import "@/__tests__/__helpers__/ResizeObserverMock";
import * as QuizEngineProvider from "@/components/PupilComponents/QuizEngineProvider";

// Mock the module and retain actual exports
jest.mock("@/components/PupilComponents/QuizEngineProvider", () => ({
  ...jest.requireActual("@/components/PupilComponents/QuizEngineProvider"),
  useQuizEngineContext: jest.fn(),
}));

jest.mock("@oaknational/oak-components", () => {
  return {
    ...jest.requireActual("@oaknational/oak-components"),
    OakQuizMatch: () => null,
    OakQuizOrder: () => null,
    OakTooltip: ({ children, tooltip }: OakTooltipProps) => (
      <>
        {children}
        <div role="tooltip">{tooltip}</div>
      </>
    ),
  };
});

jest.mock("posthog-js/react", () => ({
  useFeatureFlagVariantKey: jest.fn(),
}));

// Type the mock function
const mockedUseFeatureFlagVariantKey =
  useFeatureFlagVariantKey as jest.MockedFunction<
    typeof useFeatureFlagVariantKey
  >;

// Mock the module and retain actual exports
jest.mock("@/components/PupilComponents/QuizEngineProvider", () => ({
  ...jest.requireActual("@/components/PupilComponents/QuizEngineProvider"),
  useQuizEngineContext: jest.fn(),
}));

const getMockedQuizEngineContext = (
  props: {
    overrides: Partial<QuizEngineProvider.QuizEngineContextType>;
  } = { overrides: {} },
) => ({
  currentQuestionData: quizQuestions[0],
  currentQuestionIndex: 0,
  currentQuestionDisplayIndex: 1,
  questionState: { mode: "feedback", grade: 0, offerHint: false },
  score: 0,
  numQuestions: 3,
  numInteractiveQuestions: 3,
  updateQuestionMode: jest.fn(),
  handleSubmitMCAnswer: jest.fn(),
  handleSubmitShortAnswer: jest.fn(),
  handleSubmitOrderAnswer: jest.fn(),
  handleSubmitMatchAnswer: jest.fn(),
  handleNextQuestion: jest.fn(),
  ...props.overrides,
});

describe("PupilQuizView", () => {
  beforeEach(() => {
    // Restore the original implementation for all tests
    (QuizEngineProvider.useQuizEngineContext as jest.Mock).mockImplementation(
      jest.requireActual("@/components/PupilComponents/QuizEngineProvider")
        .useQuizEngineContext,
    );
  });

  it("renders heading, mode and answer when there is currentQuestionData", () => {
    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={createLessonEngineContext()}>
          <PupilViewsQuiz questionsArray={quizQuestions} />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );
    const heading = getByText("Starter Quiz");
    expect(heading).toBeInTheDocument();
  });

  it("renders Next button when questionState.mode is feedback", () => {
    const { getByLabelText, getByRole } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={createLessonEngineContext()}>
          <PupilViewsQuiz questionsArray={quizQuestions} />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );
    expect(getByLabelText(/a group of letters/)).toBeInTheDocument();

    act(() => {
      fireEvent.click(getByLabelText(/a group of letters/));
      fireEvent.click(getByRole("button", { name: /Check/ }));
    });
    expect(getByRole("button", { name: /Next question/ })).toBeInTheDocument();
  });

  it("does not render Next button when questionState.mode is not feedback", () => {
    const { queryByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={createLessonEngineContext()}>
          <PupilViewsQuiz questionsArray={quizQuestions} />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );
    expect(queryByText(/Next Question/)).not.toBeInTheDocument();
  });

  it.each([
    ["exit-quiz", /Lesson review/],
    ["starter-quiz", /Continue lesson/],
  ] satisfies Array<[LessonSection, RegExp]>)(
    "for the %p section the button label for the last question is %p",
    (currentSection, label) => {
      const { getByLabelText, getByRole } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider
            value={createLessonEngineContext({ currentSection })}
          >
            <PupilViewsQuiz questionsArray={quizQuestions.slice(0, 1)} />
          </LessonEngineContext.Provider>
        </OakThemeProvider>,
      );
      expect(getByLabelText(/a group of letters/)).toBeInTheDocument();

      act(() => {
        fireEvent.click(getByLabelText(/a group of letters/));
        fireEvent.click(getByRole("button", { name: /Check/ }));
      });

      expect(getByRole("button", { name: label })).toBeInTheDocument();
    },
  );

  it.each([
    ["short-answer", shortAnswers, "You need to type an answer to move on!"],
    [
      "multiple-choice",
      mcqTextAnswers,
      "You need to select an answer to move on!",
    ],
    [
      "multiple-choice",
      [mcqCorrectAnswer, mcqCorrectAnswer, mcqIncorrectAnswer],
      "You need to select answers to move on!",
    ],
    ["order", orderAnswers, "You need to order to move on!"],
    ["match", matchAnswers, "You need to match to move on!"],
  ] satisfies Array<
    [keyof QuizQuestionAnswers, ValueOf<QuizQuestionAnswers>, string]
  >)(
    "displays a tooltip for the %p question type when it is incomplete",
    (questionType, answers, tooltipText) => {
      const { getByRole } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider value={createLessonEngineContext()}>
            <PupilViewsQuiz
              questionsArray={[
                {
                  questionId: 1,
                  questionUid: "test-question",
                  questionType,
                  questionStem: [],
                  feedback: "",
                  hint: "",
                  active: true,
                  answers: {
                    [questionType]: answers,
                  },
                  order: 0,
                },
              ]}
            />
          </LessonEngineContext.Provider>
        </OakThemeProvider>,
      );

      act(() => {
        fireEvent.click(getByRole("button", { name: /Check/ }));
      });

      expect(getByRole("tooltip")).toHaveTextContent(tooltipText);
    },
  );

  it.each([
    ["control", 0, true],
    ["only-first-question", 0, true],
    ["all-except-last-question", 0, true],
    ["control", 1, true],
    ["only-first-question", 1, false],
    ["all-except-last-question", 1, true],
    ["control", 2, true],
    ["only-first-question", 2, false],
    ["all-except-last-question", 2, false],
  ] satisfies Array<[string, number, boolean]>)(
    "selectively renders the backlink based on the variant and question index",
    (variant, index, outcome) => {
      (QuizEngineProvider.useQuizEngineContext as jest.Mock).mockReturnValue(
        getMockedQuizEngineContext({
          overrides: { currentQuestionIndex: index, numQuestions: 3 },
        }),
      );

      mockedUseFeatureFlagVariantKey.mockReturnValue(variant);

      const { getByLabelText } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider value={createLessonEngineContext()}>
            <PupilViewsQuiz questionsArray={quizQuestions} />
          </LessonEngineContext.Provider>
        </OakThemeProvider>,
      );
      if (outcome) {
        expect(getByLabelText(/Back/)).toBeInTheDocument();
      } else {
        expect(() => getByLabelText(/Back/)).toThrow(
          "Unable to find a label with the text of: /Back/",
        );
      }
    },
  );
});
