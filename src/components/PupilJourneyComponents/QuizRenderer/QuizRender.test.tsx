import React from "react";
import "@testing-library/jest-dom/extend-expect";
import "whatwg-fetch";
import "@testing-library/jest-dom";

import { QuizEngineProvider } from "../QuizEngineProvider/QuizEngineProvider";

import { QuizRenderer } from "./QuizRender";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";

jest.mock("@oak-academy/oak-components", () => {
  // const oakComponents = jest.requireActual("@oak-academy/oak-components");
  return {
    // ...oakComponents,
    OakRadioGroup: jest.fn(({ children }) => <div>{children}</div>),
    OakFlex: jest.fn(({ children }) => <div>{children}</div>),
    OakHeading: jest.fn(({ children }) => <div>{children}</div>),
    OakPrimaryButton: jest.fn(({ children }) => <div>{children}</div>),
    OakTypography: jest.fn(({ children }) => <div>{children}</div>),
    OakRadioButton: jest.fn(({ children }) => <div>{children}</div>),
  };
});

const questionsArrayFixture = quizQuestions || [];
describe("QuizRenderer", () => {
  it("renders null when no currentQuestionData", () => {
    const { getByText } = renderWithTheme(
      <QuizEngineProvider questionsArray={questionsArrayFixture}>
        <QuizRenderer />
      </QuizEngineProvider>,
    );
    const heading = getByText("Quiz Renderer");
    expect(heading).toBeInTheDocument();
  });
  it("renders heading, mode andanswer when there is currentQuestionData", () => {
    const { getByText } = renderWithTheme(
      <QuizEngineProvider questionsArray={questionsArrayFixture}>
        <QuizRenderer />
      </QuizEngineProvider>,
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
  it.todo("callshanldeSubmitMCAnswer when submit button is clicked");
  it.todo("disables next button when questionState.mode === 'feedback'");
  it.todo(
    "calls handleNextQuestion when next button is clicked and questionState.mode === 'feedback'",
  );
});
