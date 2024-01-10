import React from "react";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/jest-dom";
import { OakThemeProvider, oakDefaultTheme } from "@oak-academy/oak-components";
import { act, fireEvent } from "@testing-library/react";

import {
  QuizEngineContextType,
  QuizEngineContext,
} from "@/components/PupilJourneyComponents/QuizEngineProvider";
import { QuizRenderer } from "@/components/PupilJourneyComponents/QuizRenderer";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";

const questionsArrayFixture = quizQuestions || [];

const getContext = (): QuizEngineContextType => ({
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
  maxScore: 1,
  isComplete: false,
});

describe("QuizRenderer", () => {
  it("throws an error when there is no context", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderWithTheme(<QuizRenderer />)).toThrow();
    spy.mockRestore();
  });

  it("renders heading, mode and answer when there is currentQuestionData", () => {
    const context = getContext();
    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizEngineContext.Provider value={context}>
          <QuizRenderer />
        </QuizEngineContext.Provider>
      </OakThemeProvider>,
    );
    const heading = getByText("Quiz Renderer");
    expect(heading).toBeInTheDocument();

    const mode = getByText("mode: init");
    expect(mode).toBeInTheDocument();
  });

  it("renders questionStem when questionState.mode !== 'end'", () => {
    const context = getContext();

    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizEngineContext.Provider value={context}>
          <QuizRenderer />
        </QuizEngineContext.Provider>
      </OakThemeProvider>,
    );
    const questionStemQuestion = getByText("What is a main clause?");
    expect(questionStemQuestion).toBeInTheDocument();
  });

  it("renders OakRadioGroup when questionState.mode !== 'end'", () => {
    const context = getContext();

    const { getByLabelText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizEngineContext.Provider value={context}>
          <QuizRenderer />
        </QuizEngineContext.Provider>
      </OakThemeProvider>,
    );
    const radio1 = getByLabelText("a group of letters");
    expect(radio1).toBeInTheDocument();
  });

  it("disables submit button when mode is init", () => {
    const context = getContext();

    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizEngineContext.Provider value={context}>
          <QuizRenderer />
        </QuizEngineContext.Provider>
      </OakThemeProvider>,
    );
    expect(getByText("Submit").closest("button")).toBeDisabled();
  });

  it("updates question mode to grading when submit is clicked", () => {
    const context = getContext();

    if (context?.questionState?.[0]) {
      context.updateQuestionMode = jest.fn();
      context.questionState[0].mode = "input";

      const { getByRole } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <QuizEngineContext.Provider value={context}>
            <QuizRenderer />
          </QuizEngineContext.Provider>
        </OakThemeProvider>,
      );

      fireEvent.click(getByRole("button", { name: "Submit" }));
      expect(context.updateQuestionMode).toHaveBeenCalledWith("grading");
    }
  });

  it("renders Next button when questionState.mode is feedback", () => {
    const context = getContext();

    if (context?.questionState?.[0]) {
      context.questionState[0].mode = "feedback";
    }

    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizEngineContext.Provider value={context}>
          <QuizRenderer />
        </QuizEngineContext.Provider>
      </OakThemeProvider>,
    );
    expect(getByText("Next Question").closest("button")).toBeInTheDocument();
  });

  it("does not render Next button when questionState.mode is not feedback", () => {
    const context = getContext();

    const { queryByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizEngineContext.Provider value={context}>
          <QuizRenderer />
        </QuizEngineContext.Provider>
      </OakThemeProvider>,
    );
    expect(queryByText("Next Question")).not.toBeInTheDocument();
  });

  it("calls handleNextQuestion when next button is clicked and questionState.mode === 'feedback'", () => {
    const context = getContext();

    if (context?.questionState?.[0]) {
      context.questionState[0].mode = "feedback";
      context.handleNextQuestion = jest.fn();

      const { getByRole } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <QuizEngineContext.Provider value={context}>
            <QuizRenderer />
          </QuizEngineContext.Provider>
        </OakThemeProvider>,
      );

      fireEvent.click(getByRole("button", { name: "Next Question" }));
      expect(context.handleNextQuestion).toHaveBeenCalledTimes(1);
    }
  });

  it("renders final state when isComplete === true", () => {
    const context = getContext();

    if (context) {
      context.isComplete = true;
      context.currentQuestionIndex = 1;

      const { getByText } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <QuizEngineContext.Provider value={context}>
            <QuizRenderer />
          </QuizEngineContext.Provider>
        </OakThemeProvider>,
      );

      expect(getByText(/End of quiz/i)).toBeInTheDocument();
    }
  });

  it("captures the MCQ selected answers when submit is clicked", () => {
    const context = getContext();

    if (context?.questionState?.[0]) {
      context.questionState[0].mode = "input";
      context.handleSubmitMCAnswer = jest.fn();

      const { getByLabelText, getByRole } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <QuizEngineContext.Provider value={context}>
            <QuizRenderer />
          </QuizEngineContext.Provider>
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
    const context = getContext();

    if (context?.currentQuestionData?.answers?.["multiple-choice"]?.[1]) {
      context.currentQuestionData.answers[
        "multiple-choice"
      ][1].answer_is_correct = true;
    }

    if (context?.questionState?.[0]) {
      context.questionState[0].mode = "input";
      context.handleSubmitMCAnswer = jest.fn();

      const { getByLabelText, getByRole } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <QuizEngineContext.Provider value={context}>
            <QuizRenderer />
          </QuizEngineContext.Provider>
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
});
