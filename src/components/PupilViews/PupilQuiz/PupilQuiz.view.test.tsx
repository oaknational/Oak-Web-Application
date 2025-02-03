import { vi } from "vitest";
import React from "react";
import "@testing-library/jest-dom";
import {
  OakThemeProvider,
  OakTooltipProps,
  oakDefaultTheme,
} from "@oaknational/oak-components";
import { act, fireEvent } from "@testing-library/react";
import { ValueOf } from "next/dist/shared/lib/constants";

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
import { trackingEvents } from "@/components/PupilComponents/PupilAnalyticsProvider/PupilAnalyticsProvider";

const usePupilAnalyticsMock = {
  track: Object.fromEntries(trackingEvents.map((event) => [event, vi.fn()])),
  identify: vi.fn(),
  posthogDistinctId: "123",
};

vi.mock(
  "@/components/PupilComponents/PupilAnalyticsProvider/usePupilAnalytics",
  () => {
    return {
      usePupilAnalytics: () => usePupilAnalyticsMock,
    };
  },
);

const useGetQuizTrackingDataMock = {
  getQuizTrackingData: vi.fn(),
};

vi.mock("@/hooks/useGetQuizTrackingData", () => {
  return {
    useGetQuizTrackingData: () => useGetQuizTrackingDataMock,
  };
});

// Mock the module and retain actual exports
vi.mock("@/components/PupilComponents/QuizEngineProvider", async () => ({
  ...(await vi.importActual("@/components/PupilComponents/QuizEngineProvider")),
  useQuizEngineContext: vi.fn(),
}));

vi.mock("@oaknational/oak-components", async () => {
  return {
    ...(await vi.importActual("@oaknational/oak-components")),
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

vi.mock("posthog-js/react", () => ({
  useFeatureFlagVariantKey: vi.fn(),
}));

describe("PupilQuizView", () => {
  beforeEach(async () => {
    const actual = await vi.importActual<
      typeof import("@/components/PupilComponents/QuizEngineProvider")
    >("@/components/PupilComponents/QuizEngineProvider");

    vi.mocked(QuizEngineProvider.useQuizEngineContext).mockImplementation(
      actual.useQuizEngineContext,
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
  it("sends tracking data when a quiz is completed", () => {
    const lessonActivityCompletedStarterQuiz = vi.fn();

    vi.spyOn(
      usePupilAnalyticsMock.track,
      "lessonActivityCompletedStarterQuiz",
    ).mockImplementation(lessonActivityCompletedStarterQuiz);

    const context = createLessonEngineContext({
      currentSection: "starter-quiz",
      sectionResults: {
        "starter-quiz": {
          isComplete: true,
          grade: 1,
          numQuestions: 0,
        },
      },
    });

    vi.spyOn(QuizEngineProvider, "useQuizEngineContext").mockReturnValue({
      currentQuestionData: quizQuestions[5],
      currentQuestionIndex: 5,
      currentQuestionDisplayIndex: 5,
      currentQuestionState: {
        correctAnswer: ["680", "680 ml"],
        mode: "feedback",
        offerHint: false,
        grade: 1,
        isPartiallyCorrect: false,
        pupilAnswer: "680",
      },
      questionState: [
        { mode: "init", offerHint: false, grade: 0 },
        { mode: "init", offerHint: false, grade: 0 },
        { mode: "init", offerHint: false, grade: 0 },
        { mode: "init", offerHint: false, grade: 0 },
        { mode: "init", offerHint: false, grade: 0 },
        { mode: "feedback", offerHint: false, grade: 0 },
      ],
      score: 0,
      numQuestions: 6,
      numInteractiveQuestions: 6,
      updateQuestionMode: vi.fn(),
      updateHintOffered: vi.fn(),
      handleSubmitMCAnswer: vi.fn(),
      handleSubmitShortAnswer: vi.fn(),
      handleSubmitOrderAnswer: vi.fn(),
      handleSubmitMatchAnswer: vi.fn(),
      handleNextQuestion: vi.fn(),
    });

    const { getByRole } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={context}>
          <PupilViewsQuiz questionsArray={quizQuestions} />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );

    fireEvent.click(getByRole("button", { name: /Continue lesson/i }));
    expect(lessonActivityCompletedStarterQuiz).toHaveBeenCalledTimes(1);
  });
  it("sends abandoned event data when backbutton clicked", () => {
    const lessonActivityAbandonedStarterQuiz = vi.fn();

    vi.spyOn(
      usePupilAnalyticsMock.track,
      "lessonActivityAbandonedStarterQuiz",
    ).mockImplementation(lessonActivityAbandonedStarterQuiz);

    const { getByRole } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={createLessonEngineContext()}>
          <PupilViewsQuiz questionsArray={quizQuestions} />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );

    fireEvent.click(getByRole("link", { name: /Back/i }));
    expect(lessonActivityAbandonedStarterQuiz).toHaveBeenCalledTimes(1);
  });
});
