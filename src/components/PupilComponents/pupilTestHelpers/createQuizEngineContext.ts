import { vi } from "vitest";

import { QuizEngineContextType } from "../QuizEngineProvider";

import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";
import { QuizQuestion } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";

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
    updateQuestionMode: vi.fn(),
    updateHintOffered: vi.fn(),
    handleSubmitMCAnswer: vi.fn(),
    handleNextQuestion: vi.fn(),
    handleSubmitShortAnswer: vi.fn(),
    handleSubmitOrderAnswer: vi.fn(),
    handleSubmitMatchAnswer: vi.fn(),
    ...overrides,
  };
}

export function createQuestionData(
  overrides: Partial<QuizQuestion>,
): QuizQuestion {
  return {
    ...quizQuestions[0]!,
    ...overrides,
  };
}
