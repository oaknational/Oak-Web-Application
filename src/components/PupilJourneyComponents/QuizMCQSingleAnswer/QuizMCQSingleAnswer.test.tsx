import React from "react";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/jest-dom";
import { OakThemeProvider, oakDefaultTheme } from "@oak-academy/oak-components";

import { QuizMCQSingleAnswer } from "./QuizMCQSingleAnswer";

import {
  QuizEngineContextType,
  QuizEngineContext,
} from "@/components/PupilJourneyComponents/QuizEngineProvider";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";

const questionsArrayFixture = quizQuestions || [];

const getContext = (): NonNullable<QuizEngineContextType> => ({
  currentQuestionData: questionsArrayFixture[0],
  currentQuestionIndex: 0,
  questionState: [
    {
      mode: "init",
      offerHint: false,
      grade: 0,
    },
  ],
  updateQuestionMode: jest.fn(),
  handleSubmitMCAnswer: jest.fn(),
  handleNextQuestion: jest.fn(),
  score: 0,
  maxScore: 1,
  isComplete: false,
});

describe("QuizMCQSingleAnswer", () => {
  it("renders the question answers", () => {
    const context = getContext();

    const answers =
      context?.currentQuestionData?.answers?.["multiple-choice"] ?? [];

    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizEngineContext.Provider value={context}>
          <QuizMCQSingleAnswer questionUid="123" answers={answers} />
        </QuizEngineContext.Provider>
      </OakThemeProvider>,
    );

    if (context?.currentQuestionData?.answers?.["multiple-choice"]) {
      for (const answer of context.currentQuestionData.answers[
        "multiple-choice"
      ]) {
        for (const t of answer.answer) {
          if (t.type === "text") {
            const answerText = getByText(t.text);
            expect(answerText).toBeInTheDocument();
          }
        }
      }
    }
  });

  it("changes the mode from init to input when an answer is selected", () => {
    const context = getContext();

    const answers =
      context?.currentQuestionData?.answers?.["multiple-choice"] ?? [];

    const { getAllByRole } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizEngineContext.Provider value={context}>
          <QuizMCQSingleAnswer questionUid="123" answers={answers} />
        </QuizEngineContext.Provider>
      </OakThemeProvider>,
    );

    const answerInput = getAllByRole("radio")[0];
    expect(answerInput).toBeInTheDocument();

    answerInput?.click();

    expect(context.updateQuestionMode).toHaveBeenCalledWith("input");
  });

  it("calls handleSubmitMCAnswer when questionState.mode is set to grading", () => {
    const context = getContext();

    if (context.questionState[0]) {
      context.questionState[0].mode = "grading";
    }

    const answers =
      context?.currentQuestionData?.answers?.["multiple-choice"] ?? [];

    renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizEngineContext.Provider value={context}>
          <QuizMCQSingleAnswer questionUid="123" answers={answers} />
        </QuizEngineContext.Provider>
      </OakThemeProvider>,
    );

    expect(context.handleSubmitMCAnswer).toHaveBeenCalledTimes(1);
  });
});
