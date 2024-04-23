import React from "react";
import "@testing-library/jest-dom";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { createQuizEngineContext } from "../pupilTestHelpers/createQuizEngineContext";

import { QuizMCQSingleAnswer } from "./QuizMCQSingleAnswer";

import {
  QuizEngineContextType,
  QuizEngineContext,
} from "@/components/PupilComponents/QuizEngineProvider";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";
import { isText } from "@/components/PupilComponents/QuizUtils/stemUtils";

const questionsArrayFixture = quizQuestions || [];

const getContext = (): NonNullable<QuizEngineContextType> =>
  createQuizEngineContext({
    currentQuestionData: questionsArrayFixture[0],
    numQuestions: 1,
  });

describe("QuizMCQSingleAnswer", () => {
  it("renders the question answers", () => {
    const context = getContext();

    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizEngineContext.Provider value={context}>
          <QuizMCQSingleAnswer onChange={() => {}} />
        </QuizEngineContext.Provider>
      </OakThemeProvider>,
    );

    if (context.currentQuestionData?.answers?.["multiple-choice"]) {
      for (const answer of context.currentQuestionData.answers[
        "multiple-choice"
      ]) {
        for (const t of answer.answer) {
          if (isText(t)) {
            const answerText = getByText(t.text);
            expect(answerText).toBeInTheDocument();
          }
        }
      }
    }
  });
});
