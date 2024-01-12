import React from "react";
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
  handleSubmitShortAnswer: jest.fn(),
  score: 0,
  maxScore: 1,
  isComplete: false,
});

describe("QuizMCQSingleAnswer", () => {
  it("renders the question answers", () => {
    const context = getContext();

    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizEngineContext.Provider value={context}>
          <QuizMCQSingleAnswer />
        </QuizEngineContext.Provider>
      </OakThemeProvider>,
    );

    if (context.currentQuestionData?.answers?.["multiple-choice"]) {
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
});
