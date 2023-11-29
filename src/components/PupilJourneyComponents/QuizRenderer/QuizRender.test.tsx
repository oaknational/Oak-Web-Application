import React from "react";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/jest-dom";
import { OakThemeProvider, oakDefaultTheme } from "@oak-academy/oak-components";
import { fireEvent } from "@testing-library/react";

import {
  QuizEngineContext,
  QuizEngineProvider,
  quizEngineContext,
} from "../QuizEngineProvider/QuizEngineProvider";

import { QuizRenderer } from "./QuizRender";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";

const questionsArrayFixture = quizQuestions || [];
describe("QuizRenderer", () => {
  it("renders null when no currentQuestionData", () => {
    const { container } = renderWithTheme(<QuizRenderer />);
    expect(container.innerHTML).toBe("");
  });
  it("renders heading, mode and answer when there is currentQuestionData", () => {
    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizEngineProvider questionsArray={questionsArrayFixture}>
          <QuizRenderer />
        </QuizEngineProvider>
      </OakThemeProvider>,
    );
    const heading = getByText("Quiz Renderer");
    expect(heading).toBeInTheDocument();

    const mode = getByText("mode: input");
    expect(mode).toBeInTheDocument();

    const answer = getByText("answer: not answered");
    expect(answer).toBeInTheDocument();
  });
  it("renders questionStem when questionState.mode !== 'end'", () => {
    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizEngineProvider questionsArray={questionsArrayFixture}>
          <QuizRenderer />
        </QuizEngineProvider>
      </OakThemeProvider>,
    );
    const questionStemQuestion = getByText("What is a main clause?");
    expect(questionStemQuestion).toBeInTheDocument();
  });
  it("renders OakRadioGroup when questionState.mode !== 'end'", () => {
    const context: QuizEngineContext = {
      currentQuestionData: questionsArrayFixture[0],
      currentQuestionIndex: 0,
      questionState: {
        mode: "input",
        answer: undefined,
        offerHint: false,
        score: 2,
        maximumScore: 3,
      },
      handleSubmitMCAnswer: () => {},
      handleNextQuestion: () => {},
    };

    const { getByLabelText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <quizEngineContext.Provider value={context}>
          <QuizRenderer />
        </quizEngineContext.Provider>
      </OakThemeProvider>,
    );
    const radio1 = getByLabelText("a group of letters");
    expect(radio1).toBeInTheDocument();
  });
  it("disable submit button when selectedAnswer === undefined", () => {
    const context: QuizEngineContext = {
      currentQuestionData: questionsArrayFixture[0],
      currentQuestionIndex: 0,
      questionState: {
        mode: "input",
        answer: undefined,
        offerHint: false,
        score: 2,
        maximumScore: 3,
      },
      handleSubmitMCAnswer: () => {},
      handleNextQuestion: () => {},
    };

    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <quizEngineContext.Provider value={context}>
          <QuizRenderer />
        </quizEngineContext.Provider>
      </OakThemeProvider>,
    );
    expect(getByText("Submit").closest("button")).toBeDisabled();
  });
  it("calls hanldeSubmitMCAnswer when submit button is clicked", () => {
    const context: QuizEngineContext = {
      currentQuestionData: questionsArrayFixture[0],
      currentQuestionIndex: 0,
      questionState: {
        mode: "input",
        answer: undefined,
        offerHint: false,
        score: 2,
        maximumScore: 3,
      },
      handleSubmitMCAnswer: jest.fn(),
      handleNextQuestion: () => {},
    };

    const { getByText, getByLabelText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <quizEngineContext.Provider value={context}>
          <QuizRenderer />
        </quizEngineContext.Provider>
      </OakThemeProvider>,
    );
    const radio1 = getByLabelText("a group of letters");
    fireEvent.click(radio1);
    fireEvent.click(getByText("Submit"));
    expect(context.handleSubmitMCAnswer).toHaveBeenCalledTimes(1);
  });
  it("render Next buttonwhen questionState.mode is feedback", () => {
    const context: QuizEngineContext = {
      currentQuestionData: questionsArrayFixture[0],
      currentQuestionIndex: 0,
      questionState: {
        mode: "feedback",
        answer: undefined,
        offerHint: false,
        score: 2,
        maximumScore: 3,
      },
      handleSubmitMCAnswer: () => {},
      handleNextQuestion: () => {},
    };

    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <quizEngineContext.Provider value={context}>
          <QuizRenderer />
        </quizEngineContext.Provider>
      </OakThemeProvider>,
    );
    expect(getByText("Next Question").closest("button")).toBeInTheDocument();
  });
  it("Does not render Next buttonwhen questionState.mode is not feedback", () => {
    const context: QuizEngineContext = {
      currentQuestionData: questionsArrayFixture[0],
      currentQuestionIndex: 0,
      questionState: {
        mode: "input",
        answer: undefined,
        offerHint: false,
        score: 2,
        maximumScore: 3,
      },
      handleSubmitMCAnswer: () => {},
      handleNextQuestion: () => {},
    };

    const { queryByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <quizEngineContext.Provider value={context}>
          <QuizRenderer />
        </quizEngineContext.Provider>
      </OakThemeProvider>,
    );
    expect(queryByText("Next Question")).not.toBeInTheDocument();
  });
  it("calls handleNextQuestion when next button is clicked and questionState.mode === 'feedback'", () => {
    const context: QuizEngineContext = {
      currentQuestionData: questionsArrayFixture[0],
      currentQuestionIndex: 0,
      questionState: {
        mode: "feedback",
        answer: undefined,
        offerHint: false,
        score: 2,
        maximumScore: 3,
      },
      handleSubmitMCAnswer: () => {},
      handleNextQuestion: jest.fn(),
    };

    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <quizEngineContext.Provider value={context}>
          <QuizRenderer />
        </quizEngineContext.Provider>
      </OakThemeProvider>,
    );
    fireEvent.click(getByText("Next Question"));
    expect(context.handleNextQuestion).toHaveBeenCalledTimes(1);
  });
  it("questionState.mode === 'end', render score", () => {
    const context: QuizEngineContext = {
      currentQuestionData: questionsArrayFixture[0],
      currentQuestionIndex: 0,
      questionState: {
        mode: "end",
        answer: undefined,
        offerHint: false,
        score: 2,
        maximumScore: 3,
      },
      handleSubmitMCAnswer: () => {},
      handleNextQuestion: () => {},
    };

    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <quizEngineContext.Provider value={context}>
          <QuizRenderer />
        </quizEngineContext.Provider>
      </OakThemeProvider>,
    );

    const showscore = getByText("End of quiz, score: 2/3");
    expect(showscore).toBeInTheDocument();
  });
});
