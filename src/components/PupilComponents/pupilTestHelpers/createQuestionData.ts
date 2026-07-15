import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";
import { QuizQuestion } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";

export function createQuestionData(
  overrides: Partial<QuizQuestion>,
): QuizQuestion {
  return {
    ...quizQuestions[0]!,
    ...overrides,
  };
}
