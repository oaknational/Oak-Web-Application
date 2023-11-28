import React from "react";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/jest-dom";
import { OakThemeProvider, oakDefaultTheme } from "@oak-academy/oak-components";

import { QuizEngineProvider } from "../QuizEngineProvider/QuizEngineProvider";

import { QuizRenderer } from "./QuizRender";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";

const questionsArrayFixture = quizQuestions || [];
describe("QuizRenderer", () => {
  it("renders null when no currentQuestionData", () => {
    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizEngineProvider questionsArray={questionsArrayFixture}>
          <QuizRenderer />
        </QuizEngineProvider>
      </OakThemeProvider>,
    );
    const heading = getByText("Quiz Renderer");
    expect(heading).toBeInTheDocument();
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
  it.todo("questionState.mode === 'end', render score");
  it.todo("renders questionStem when questionState.mode !== 'end'");
  it.todo("renders OakRadioGroup when questionState.mode !== 'end'");
  it.todo(
    "disable submit button when selectedAnswer === undefined || questionState.mode === feedback",
  );
  it.todo("calls hanldeSubmitMCAnswer when submit button is clicked");
  it.todo("disables next button when questionState.mode === 'feedback'");
  it.todo(
    "calls handleNextQuestion when next button is clicked and questionState.mode === 'feedback'",
  );
});
