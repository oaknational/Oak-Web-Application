import React from "react";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/jest-dom";
import { OakThemeProvider, oakDefaultTheme } from "@oak-academy/oak-components";

import { QuizMCQMultiAnswer } from "./QuizMCQMultiAnswer";

import {
  QuizEngineContext,
  QuizEngineContextType,
} from "@/components/PupilJourneyComponents/QuizEngineProvider";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { mcqTextAnswers } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";

// mock the QuizEngineContext
const mockQuizEngineContext: QuizEngineContextType = {
  currentQuestionData: {
    questionUid: "test",
    questionId: 0,
    questionType: "multiple-choice",
    questionStem: [
      {
        type: "text",
        text: "Test question",
      },
    ],
    answers: { "multiple-choice": mcqTextAnswers },
    feedback: "",
    hint: "",
    active: true,
  },
  currentQuestionIndex: 0,
  questionState: [
    {
      mode: "input",
      grade: 0,
      offerHint: false,
    },
  ],
  score: 0,
  maxScore: 0,
  isComplete: false,
  updateQuestionMode: jest.fn(),
  handleSubmitMCAnswer: jest.fn(),
  handleNextQuestion: jest.fn(),
};

describe("QuizMCQMultiAnswer", () => {
  const multiMcqTextAnswers = [...mcqTextAnswers];

  beforeAll(() => {
    // Make multiple answers correct
    if (multiMcqTextAnswers[0]) {
      multiMcqTextAnswers[0].answer_is_correct = true;
    }
    if (multiMcqTextAnswers[2]) {
      multiMcqTextAnswers[2].answer_is_correct = true;
    }
  });

  it("renders the answers", () => {
    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizEngineContext.Provider value={mockQuizEngineContext}>
          <QuizMCQMultiAnswer questionUid="test" answers={mcqTextAnswers} />
        </QuizEngineContext.Provider>
      </OakThemeProvider>,
    );

    for (const answer of mcqTextAnswers) {
      if (answer.answer?.[0]?.type === "text") {
        expect(getByText(answer.answer[0].text)).toBeInTheDocument();
      }
    }
  });

  it("renders the answers as clickable in input mode", () => {
    const { getByRole } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizEngineContext.Provider value={mockQuizEngineContext}>
          <QuizMCQMultiAnswer questionUid="test" answers={mcqTextAnswers} />
        </QuizEngineContext.Provider>
      </OakThemeProvider>,
    );

    for (const answer of mcqTextAnswers) {
      if (answer.answer?.[0]?.type === "text") {
        getByRole("checkbox", { name: answer.answer[0].text }).click();
        expect(
          getByRole("checkbox", { name: answer.answer[0].text }),
        ).toBeChecked();
      }
    }
  });

  it("renders the answers as unclickable in feedback mode", () => {
    const mockQuizEngineContextFeedback: QuizEngineContextType = {
      ...mockQuizEngineContext,
    };

    if (mockQuizEngineContextFeedback.questionState[0]) {
      mockQuizEngineContextFeedback.questionState[0].mode = "feedback";
      mockQuizEngineContextFeedback.questionState[0].feedback = [
        "correct",
        "correct",
        "correct",
        "correct",
      ];
    }

    const { getByRole } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizEngineContext.Provider value={mockQuizEngineContextFeedback}>
          <QuizMCQMultiAnswer questionUid="test" answers={mcqTextAnswers} />
        </QuizEngineContext.Provider>
      </OakThemeProvider>,
    );

    for (const answer of mcqTextAnswers) {
      if (answer.answer?.[0]?.type === "text") {
        expect(
          getByRole("checkbox", { name: answer.answer[0].text }),
        ).toBeDisabled();

        getByRole("checkbox", { name: answer.answer[0].text }).click();
        expect(
          getByRole("checkbox", { name: answer.answer[0].text }),
        ).not.toBeChecked();
      }
    }
  });
});
