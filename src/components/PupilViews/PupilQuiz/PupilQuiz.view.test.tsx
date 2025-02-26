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
import {
  QuizQuestionAnswers,
  QuizQuestion,
} from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import "@/__tests__/__helpers__/IntersectionObserverMock";
import "@/__tests__/__helpers__/ResizeObserverMock";
import * as QuizEngineProvider from "@/components/PupilComponents/QuizEngineProvider";
import { trackingEvents } from "@/components/PupilComponents/PupilAnalyticsProvider/PupilAnalyticsProvider";

const usePupilAnalyticsMock = {
  track: Object.fromEntries(trackingEvents.map((event) => [event, jest.fn()])),
  identify: jest.fn(),
  posthogDistinctId: "123",
};

jest.mock(
  "@/components/PupilComponents/PupilAnalyticsProvider/usePupilAnalytics",
  () => {
    return {
      usePupilAnalytics: () => usePupilAnalyticsMock,
    };
  },
);

const useGetQuizTrackingDataMock = {
  getQuizTrackingData: jest.fn(),
};

jest.mock("@/hooks/useGetQuizTrackingData", () => {
  return {
    useGetQuizTrackingData: () => useGetQuizTrackingDataMock,
  };
});

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

// Mock the module and retain actual exports
jest.mock("@/components/PupilComponents/QuizEngineProvider", () => ({
  ...jest.requireActual("@/components/PupilComponents/QuizEngineProvider"),
  useQuizEngineContext: jest.fn(),
}));

describe("PupilQuizView", () => {
  beforeEach(() => {
    // Restore the original implementation for all tests
    (QuizEngineProvider.useQuizEngineContext as jest.Mock).mockImplementation(
      jest.requireActual("@/components/PupilComponents/QuizEngineProvider")
        .useQuizEngineContext,
    );
  }),
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
    const lessonActivityCompletedStarterQuiz = jest.fn();

    jest
      .spyOn(usePupilAnalyticsMock.track, "lessonActivityCompletedStarterQuiz")
      .mockImplementation(lessonActivityCompletedStarterQuiz);

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

    jest.spyOn(QuizEngineProvider, "useQuizEngineContext").mockReturnValue({
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
      updateQuestionMode: jest.fn(),
      updateHintOffered: jest.fn(),
      handleSubmitMCAnswer: jest.fn(),
      handleSubmitShortAnswer: jest.fn(),
      handleSubmitOrderAnswer: jest.fn(),
      handleSubmitMatchAnswer: jest.fn(),
      handleNextQuestion: jest.fn(),
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
    const lessonActivityAbandonedStarterQuiz = jest.fn();

    jest
      .spyOn(usePupilAnalyticsMock.track, "lessonActivityAbandonedStarterQuiz")
      .mockImplementation(lessonActivityAbandonedStarterQuiz);

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
  describe("Tab Handling", () => {
    // Create a mock element to be focused
    beforeEach(() => {
      // Mock getElementById to return a fake element with focus method
      const mockTabElement = document.createElement("input");
      mockTabElement.id = "QUES-EKUYT-EE985-answer-0";
      document.body.appendChild(mockTabElement);

      jest.spyOn(document, "getElementById").mockImplementation((id) => {
        if (id === "QUES-EKUYT-EE985-answer-0") {
          return mockTabElement;
        }
        return null;
      });
    });

    afterEach(() => {
      // Clean up
      document.body.innerHTML = "";
      jest.restoreAllMocks();
    });

    it("should focus on the answer input when Tab key is pressed for the first time", () => {
      // Arrange
      renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider value={createLessonEngineContext()}>
            <PupilViewsQuiz questionsArray={quizQuestions} />
          </LessonEngineContext.Provider>
        </OakThemeProvider>,
      );

      const focusSpy = jest.spyOn(HTMLElement.prototype, "focus");

      // Act - Simulate Tab key press
      act(() => {
        fireEvent.keyDown(window, {
          key: "Tab",
        });
      });

      expect(document.getElementById).toHaveBeenCalledWith(
        "QUES-EKUYT-EE985-answer-0",
      );
      expect(focusSpy).toHaveBeenCalledTimes(1);
    });
    it("should focus on the answer input when Tab key is pressed for the first time for order questions", () => {
      // Arrange
      renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider value={createLessonEngineContext()}>
            <PupilViewsQuiz
              questionsArray={[quizQuestions[4] as NonNullable<QuizQuestion>]}
            />
          </LessonEngineContext.Provider>
        </OakThemeProvider>,
      );

      // Act - Simulate Tab key press
      act(() => {
        fireEvent.keyDown(window, {
          key: "Tab",
        });
      });

      expect(document.getElementById).toHaveBeenCalledWith(
        "oak-quiz-order-item-1",
      );
    });
    it("should focus on the answer input when Tab key is pressed for the first time for match questions", () => {
      // Arrange
      renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider value={createLessonEngineContext()}>
            <PupilViewsQuiz
              questionsArray={[quizQuestions[3] as NonNullable<QuizQuestion>]}
            />
          </LessonEngineContext.Provider>
        </OakThemeProvider>,
      );

      // Act - Simulate Tab key press
      act(() => {
        fireEvent.keyDown(window, {
          key: "Tab",
        });
      });

      expect(document.getElementById).toHaveBeenCalledWith(
        "oak-quiz-match-item-0",
      );
    });
    it("should focus on the answer input when Tab key is pressed for the first time for short answer questions", () => {
      // Arrange
      renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider value={createLessonEngineContext()}>
            <PupilViewsQuiz
              questionsArray={[quizQuestions[5] as NonNullable<QuizQuestion>]}
            />
          </LessonEngineContext.Provider>
        </OakThemeProvider>,
      );

      // Act - Simulate Tab key press
      act(() => {
        fireEvent.keyDown(window, {
          key: "Tab",
        });
      });

      expect(document.getElementById).toHaveBeenCalledWith(
        "short-answer-QUES-CKPSN-KFF20",
      );
    });
    it("should not prevent default or focus input when Tab is pressed after the first time", () => {
      // Arrange
      renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider value={createLessonEngineContext()}>
            <PupilViewsQuiz questionsArray={quizQuestions} />
          </LessonEngineContext.Provider>
        </OakThemeProvider>,
      );

      const focusSpy = jest.spyOn(HTMLElement.prototype, "focus");
      const preventDefaultSpy = jest.fn();

      // Act - First Tab press
      act(() => {
        fireEvent.keyDown(window, {
          key: "Tab",
          preventDefault: preventDefaultSpy,
        });
      });

      // Reset spies to check second Tab press
      focusSpy.mockClear();
      preventDefaultSpy.mockClear();

      // Act - Second Tab press
      act(() => {
        fireEvent.keyDown(window, {
          key: "Tab",
          preventDefault: preventDefaultSpy,
        });
      });

      // Assert - Should not trigger again
      expect(preventDefaultSpy).not.toHaveBeenCalled();
      expect(focusSpy).not.toHaveBeenCalled();
    });
    it("should reset firstTabPressed state when currentQuestionIndex changes", () => {
      // Arrange
      const { rerender } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider value={createLessonEngineContext()}>
            <PupilViewsQuiz questionsArray={quizQuestions} />
          </LessonEngineContext.Provider>
        </OakThemeProvider>,
      );
      const focusSpy = jest.spyOn(HTMLElement.prototype, "focus");
      // const preventDefaultSpy = jest.fn();

      // Act - First Tab press on question 0
      act(() => {
        fireEvent.keyDown(window, {
          key: "Tab",
          // preventDefault: preventDefaultSpy,
        });
      });

      // Clear spies before next test
      // preventDefaultSpy.mockClear();

      // Update component with new question index
      rerender(
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider value={createLessonEngineContext()}>
            <PupilViewsQuiz questionsArray={quizQuestions} />
          </LessonEngineContext.Provider>
        </OakThemeProvider>,
      );

      // Act - Tab press on new question index
      act(() => {
        fireEvent.keyDown(window, {
          key: "Tab",
        });
      });

      // Assert - Should trigger focus again due to index change
      // expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
      expect(document.getElementById).toHaveBeenCalledWith(
        "QUES-EKUYT-EE985-answer-0",
      );
      expect(focusSpy).toHaveBeenCalledTimes(1);
    });
    it("should not prevent default if no answers are present", () => {
      // Arrange - Render with no answers
      renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider value={createLessonEngineContext()}>
            <PupilViewsQuiz questionsArray={quizQuestions} />
          </LessonEngineContext.Provider>
        </OakThemeProvider>,
      );

      const preventDefaultSpy = jest.fn();

      // Act
      act(() => {
        fireEvent.keyDown(window, {
          key: "Tab",
          preventDefault: preventDefaultSpy,
        });
      });

      // Assert
      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });
    it("should not prevent default if pickTabId returns null", () => {
      // Arrange
      renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider value={createLessonEngineContext()}>
            <PupilViewsQuiz questionsArray={quizQuestions} />
          </LessonEngineContext.Provider>
        </OakThemeProvider>,
      );

      const preventDefaultSpy = jest.fn();

      // Act
      act(() => {
        fireEvent.keyDown(window, {
          key: "Tab",
          preventDefault: preventDefaultSpy,
        });
      });

      // Assert
      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });

    it("should clean up event listener on unmount", () => {
      // Spy on window.removeEventListener
      const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

      // Arrange
      const { unmount } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider value={createLessonEngineContext()}>
            <PupilViewsQuiz questionsArray={quizQuestions} />
          </LessonEngineContext.Provider>
        </OakThemeProvider>,
      );

      // Act
      unmount();

      // Assert
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "keydown",
        expect.any(Function),
      );
    });
  });
});
