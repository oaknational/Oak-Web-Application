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
  isReadOnly: boolean;
}): QuizNextStep => {
  const nextQuestionIndex = Math.min(currentQuestionIndex + 1, numQuestions);

  if (isReadOnly) {
    return { action: "go-review" };
  }

  if (nextQuestionIndex === numQuestions) {
    return { action: "complete-quiz" };
  }

  return { action: "next-question" };
};
