import { QuizSection } from "./isQuizSection";

type QuizNextStep =
  | { action: "complete-quiz" }
  | { action: "go-review" }
  | { action: "next-question" };

export const getQuizNextStep = ({
  currentQuestionIndex,
  numQuestions,
  isReadOnly,
}: {
  currentQuestionIndex: number;
  numQuestions: number;
  currentSection: QuizSection;
  isReadOnly: boolean;
}): QuizNextStep => {
  const nextQuestionIndex = Math.min(currentQuestionIndex + 1, numQuestions);

  if (nextQuestionIndex === numQuestions) {
    return { action: "complete-quiz" };
  }

  if (isReadOnly) {
    return { action: "go-review" };
  }

  return { action: "next-question" };
};
