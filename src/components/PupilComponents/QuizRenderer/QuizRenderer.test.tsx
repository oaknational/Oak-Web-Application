import { describe, expect, it, vi } from "vitest";
import { OakThemeProvider, oakDefaultTheme } from "@oak-academy/oak-components";
import { act, fireEvent } from "@testing-library/react";

import {
  QuizEngineContextType,
  QuizEngineContext,
} from "@/components/PupilComponents/QuizEngineProvider";
import { QuizRenderer } from "@/components/PupilComponents/QuizRenderer";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";
import {
  LessonEngineContext,
  LessonEngineContextType,
} from "@/components/PupilComponents/LessonEngineProvider";

const questionsArrayFixture = quizQuestions || [];

const getQuizEngineContext = (): NonNullable<QuizEngineContextType> => ({
  currentQuestionData: questionsArrayFixture[0],
  currentQuestionIndex: 0,
  questionState: [
    {
      mode: "init",
      offerHint: false,
      grade: 0,
    },
  ],
  updateQuestionMode: (mode) => mode,
  handleSubmitMCAnswer: () => {},
  handleNextQuestion: () => {},
  handleSubmitShortAnswer: () => {},
  score: 0,
  numQuestions: 1,
});

const getLessonEngineContext = (): NonNullable<LessonEngineContextType> => ({
  currentSection: "starter-quiz",
  completedSections: [],
  sectionResults: {},
  getIsComplete: vi.fn(),
  completeSection: vi.fn(),
  updateCurrentSection: vi.fn(),
  proceedToNextSection: vi.fn(),
  updateQuizResult: vi.fn(),
});

describe("QuizRenderer", () => {
  it("throws an error when there is no context", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderWithTheme(<QuizRenderer />)).toThrow();
    spy.mockRestore();
  });

  it("renders heading, mode and answer when there is currentQuestionData", () => {
    const context = getQuizEngineContext();
    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={getLessonEngineContext()}>
          <QuizEngineContext.Provider value={context}>
            <QuizRenderer />
          </QuizEngineContext.Provider>
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );
    const heading = getByText("Starter Quiz");
    expect(heading).toBeInTheDocument();

    const mode = getByText("mode: init");
    expect(mode).toBeInTheDocument();
  });

  it("renders questionStem when questionState.mode !== 'end'", () => {
    const context = getQuizEngineContext();

    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={getLessonEngineContext()}>
          <QuizEngineContext.Provider value={context}>
            <QuizRenderer />
          </QuizEngineContext.Provider>
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );
    const questionStemQuestion = getByText("What is a main clause?");
    expect(questionStemQuestion).toBeInTheDocument();
  });

  it("renders OakRadioGroup when questionState.mode !== 'end'", () => {
    const context = getQuizEngineContext();

    const { getByLabelText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={getLessonEngineContext()}>
          <QuizEngineContext.Provider value={context}>
            <QuizRenderer />
          </QuizEngineContext.Provider>
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );
    const radio1 = getByLabelText("a group of letters");
    expect(radio1).toBeInTheDocument();
  });

  it("disables submit button when mode is init", () => {
    const context = getQuizEngineContext();

    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={getLessonEngineContext()}>
          <QuizEngineContext.Provider value={context}>
            <QuizRenderer />
          </QuizEngineContext.Provider>
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );
    expect(getByText("Submit").closest("button")).toBeDisabled();
  });

  it("updates question mode to grading when submit is clicked", () => {
    const context = getQuizEngineContext();

    if (context?.questionState?.[0]) {
      context.updateQuestionMode = vi.fn();
      context.questionState[0].mode = "input";

      const { getByRole } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider value={getLessonEngineContext()}>
            <QuizEngineContext.Provider value={context}>
              <QuizRenderer />
            </QuizEngineContext.Provider>
          </LessonEngineContext.Provider>
        </OakThemeProvider>,
      );

      fireEvent.click(getByRole("button", { name: "Submit" }));
      expect(context.updateQuestionMode).toHaveBeenCalledWith("grading");
    }
  });

  it("renders Next button when questionState.mode is feedback", () => {
    const context = getQuizEngineContext();

    if (context?.questionState?.[0]) {
      context.questionState[0].mode = "feedback";
    }

    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={getLessonEngineContext()}>
          <QuizEngineContext.Provider value={context}>
            <QuizRenderer />
          </QuizEngineContext.Provider>
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );
    expect(getByText("Next Question").closest("button")).toBeInTheDocument();
  });

  it("does not render Next button when questionState.mode is not feedback", () => {
    const context = getQuizEngineContext();

    const { queryByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={getLessonEngineContext()}>
          <QuizEngineContext.Provider value={context}>
            <QuizRenderer />
          </QuizEngineContext.Provider>
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );
    expect(queryByText("Next Question")).not.toBeInTheDocument();
  });

  it("calls handleNextQuestion when next button is clicked and questionState.mode === 'feedback'", () => {
    const context = getQuizEngineContext();

    if (context?.questionState?.[0]) {
      context.questionState[0].mode = "feedback";
      context.handleNextQuestion = vi.fn();

      const { getByRole } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider value={getLessonEngineContext()}>
            <QuizEngineContext.Provider value={context}>
              <QuizRenderer />
            </QuizEngineContext.Provider>
          </LessonEngineContext.Provider>
        </OakThemeProvider>,
      );

      fireEvent.click(getByRole("button", { name: "Next Question" }));
      expect(context.handleNextQuestion).toHaveBeenCalledTimes(1);
    }
  });

  it("captures the MCQ selected answers when submit is clicked", () => {
    const context = getQuizEngineContext();

    if (context?.questionState?.[0]) {
      context.questionState[0].mode = "input";
      context.handleSubmitMCAnswer = vi.fn();

      const { getByLabelText, getByRole } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider value={getLessonEngineContext()}>
            <QuizEngineContext.Provider value={context}>
              <QuizRenderer />
            </QuizEngineContext.Provider>
          </LessonEngineContext.Provider>
        </OakThemeProvider>,
      );

      expect(getByLabelText(/a group of letters/)).toBeInTheDocument();

      act(() => {
        fireEvent.click(getByLabelText(/a group of letters/));
        fireEvent.click(getByRole("button", { name: "Submit" }));
      });

      expect(context.handleSubmitMCAnswer).toHaveBeenCalled();
      expect(context.handleSubmitMCAnswer).toHaveBeenCalledWith([
        context?.currentQuestionData?.answers?.["multiple-choice"]?.[1],
      ]);
    }
  });

  it("captures the MCQ selected answers when submit is clicked (multiple answers)", () => {
    const context = getQuizEngineContext();

    if (context?.currentQuestionData?.answers?.["multiple-choice"]?.[1]) {
      context.currentQuestionData.answers[
        "multiple-choice"
      ][1].answer_is_correct = true;
    }

    if (context?.questionState?.[0]) {
      context.questionState[0].mode = "input";
      context.handleSubmitMCAnswer = vi.fn();

      const { getByLabelText, getByRole } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider value={getLessonEngineContext()}>
            <QuizEngineContext.Provider value={context}>
              <QuizRenderer />
            </QuizEngineContext.Provider>
          </LessonEngineContext.Provider>
        </OakThemeProvider>,
      );

      expect(getByLabelText(/a group of letters/)).toBeInTheDocument();

      act(() => {
        fireEvent.click(getByLabelText(/a group of letters/));
        fireEvent.click(getByLabelText(/a group of words/));
        fireEvent.click(getByRole("button", { name: "Submit" }));
      });

      expect(context.handleSubmitMCAnswer).toHaveBeenCalled();
      expect(context.handleSubmitMCAnswer).toHaveBeenCalledWith([
        context?.currentQuestionData?.answers?.["multiple-choice"]?.[1],
        context?.currentQuestionData?.answers?.["multiple-choice"]?.[2],
      ]);
    }
  });

  it("renders a shortAnswer when questionType === 'short-answer'", () => {
    const context = getQuizEngineContext();

    context.currentQuestionData = quizQuestions?.find(
      (q) => q.questionType === "short-answer",
    );

    if (context?.currentQuestionData) {
      const { getByRole } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider value={getLessonEngineContext()}>
            <QuizEngineContext.Provider value={context}>
              <QuizRenderer />
            </QuizEngineContext.Provider>
          </LessonEngineContext.Provider>
        </OakThemeProvider>,
      );

      expect(getByRole("textbox")).toBeInTheDocument();
    }
  });

  it("calls handleSubmitShortAnswer when submit is clicked for a short answer", () => {
    const context = getQuizEngineContext();

    context.currentQuestionData = quizQuestions?.find(
      (q) => q.questionType === "short-answer",
    );

    if (context.questionState?.[0]) {
      context.questionState[0].mode = "input";
    }

    context.handleSubmitShortAnswer = vi.fn();

    const { getByRole } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={getLessonEngineContext()}>
          <QuizEngineContext.Provider value={context}>
            <QuizRenderer />
          </QuizEngineContext.Provider>
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );

    act(() => {
      const input = getByRole("textbox");
      fireEvent.change(input, { target: { value: "test" } });
      fireEvent.click(getByRole("button", { name: "Submit" }));
    });

    expect(context.handleSubmitShortAnswer).toHaveBeenCalled();
    expect(context.handleSubmitShortAnswer).toHaveBeenCalledWith("test");
  });
});
