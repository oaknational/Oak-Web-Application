import React from "react";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/jest-dom";
import { OakThemeProvider, oakDefaultTheme } from "@oak-academy/oak-components";
import { fireEvent } from "@testing-library/react";

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
  score: 0,
  maxScore: 1,
  isComplete: false,
});

describe("QuizRenderer", () => {
  it("renders null when no currentQuestionData", () => {
    const { container } = renderWithTheme(<QuizRenderer />);
    expect(container.innerHTML).toBe("");
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

  it("calls handleSubmitMCAnswer when submit button is clicked", () => {
    const context = getContext();

    if (context?.questionState?.[0]) {
      context.questionState[0].mode = "input";
      context.handleSubmitMCAnswer = jest.fn();

      const { getByText, getByLabelText } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <QuizEngineContext.Provider value={context}>
            <QuizRenderer />
          </QuizEngineContext.Provider>
        </OakThemeProvider>,
      );
      const radio1 = getByLabelText("a group of letters");
      fireEvent.click(radio1);
      fireEvent.click(getByText("Submit"));
      expect(context.handleSubmitMCAnswer).toHaveBeenCalledTimes(1);
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

      const { getByText, getByLabelText } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <QuizEngineContext.Provider value={context}>
            <QuizRenderer />
          </QuizEngineContext.Provider>
        </OakThemeProvider>,
      );
      const radio1 = getByLabelText("a group of letters");
      fireEvent.click(radio1);
      fireEvent.click(getByText("Submit"));
      expect(context.handleNextQuestion).toHaveBeenCalledTimes(1);
    }
  });

  // TODO: reinstate and modify when we have implemented the end of quiz state again

  it.skip("questionState.mode === 'end', render score", () => {
    const context = getContext();

    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizEngineContext.Provider value={context}>
          <QuizRenderer />
        </QuizEngineContext.Provider>
      </OakThemeProvider>,
    );

    const showScore = getByText("End of quiz, score: 2/3");
    expect(showScore).toBeInTheDocument();
  });
});
