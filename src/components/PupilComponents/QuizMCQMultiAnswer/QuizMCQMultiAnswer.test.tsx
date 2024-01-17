import React from "react";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/jest-dom";
import { OakThemeProvider, oakDefaultTheme } from "@oak-academy/oak-components";

import { QuizMCQMultiAnswer } from "./QuizMCQMultiAnswer";

import {
  QuizEngineContext,
  QuizEngineContextType,
} from "@/components/PupilComponents/QuizEngineProvider";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import {
  mcqTextAnswers,
  mcqImageAnswers,
} from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";
import { LessonOverviewQuizQuestion } from "@/node-lib/curriculum-api-2023/shared.schema";

describe("QuizMCQMultiAnswer", () => {
  const multiMcqTextAnswers = [...mcqTextAnswers];

  const multiMcqImageAnswers = [...mcqImageAnswers];

  // Make multiple answers correct
  if (multiMcqTextAnswers[0]) {
    multiMcqTextAnswers[0].answer_is_correct = true;
  }
  if (multiMcqTextAnswers[2]) {
    multiMcqTextAnswers[2].answer_is_correct = true;
  }

  if (multiMcqImageAnswers[0]) {
    multiMcqImageAnswers[0].answer_is_correct = true;
  }
  if (multiMcqImageAnswers[2]) {
    multiMcqImageAnswers[2].answer_is_correct = true;
  }

  // mock the QuizEngineContext
  const mockQuizEngineContext: NonNullable<QuizEngineContextType> = {
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
      answers: { "multiple-choice": multiMcqTextAnswers },
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
    updateQuestionMode: jest.fn(),
    handleSubmitMCAnswer: jest.fn(),
    handleNextQuestion: jest.fn(),
    handleSubmitShortAnswer: jest.fn(),
  };

  const mockQuizEngineContextWithImageAnswers: QuizEngineContextType = {
    ...mockQuizEngineContext,
    currentQuestionData: {
      ...(mockQuizEngineContext.currentQuestionData as LessonOverviewQuizQuestion),
      answers: { "multiple-choice": multiMcqImageAnswers },
    },
  };

  it("renders the answers", () => {
    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizEngineContext.Provider value={mockQuizEngineContext}>
          <QuizMCQMultiAnswer />
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
          <QuizMCQMultiAnswer />
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
      questionState: [
        {
          mode: "feedback",
          grade: 0,
          offerHint: false,
          feedback: ["correct", "correct", "correct", "correct"],
        },
      ],
    };

    const { getByRole } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizEngineContext.Provider value={mockQuizEngineContextFeedback}>
          <QuizMCQMultiAnswer />
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

  it("renders images when they are present in the answers", () => {
    const { getAllByRole } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizEngineContext.Provider
          value={mockQuizEngineContextWithImageAnswers}
        >
          <QuizMCQMultiAnswer />
        </QuizEngineContext.Provider>
      </OakThemeProvider>,
    );
    const images = getAllByRole("img", { name: "" }); // NB. Images are currently unnamed but this will need to be replaced with alt text based search
    expect(images.length).toEqual(mcqImageAnswers.length);
  });
});
