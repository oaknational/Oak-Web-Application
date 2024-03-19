import { QuizEngineContextType } from "../QuizEngineProvider";

import { LessonOverviewQuizQuestion } from "@/node-lib/curriculum-api-2023/shared.schema";
import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";

export function createQuizEngineContext(
  overrides?: Partial<QuizEngineContextType>,
): NonNullable<QuizEngineContextType> {
  return {
    currentQuestionIndex: 0,
    numInteractiveQuestions: 0,
    currentQuestionDisplayIndex: 0,
    numQuestions: 0,
    questionState: [
      {
        mode: "init",
        offerHint: false,
        grade: 0,
      },
    ],
    score: 0,
    updateQuestionMode: jest.fn(),
    handleSubmitMCAnswer: jest.fn(),
    handleNextQuestion: jest.fn(),
    handleSubmitShortAnswer: jest.fn(),
    handleSubmitOrderAnswer: jest.fn(),
    handleSubmitMatchAnswer: jest.fn(),
    ...overrides,
  };
}

export function createQuestionData(
  overrides: Partial<LessonOverviewQuizQuestion>,
): LessonOverviewQuizQuestion {
  return {
    ...quizQuestions[0]!,
    ...overrides,
  };
}
