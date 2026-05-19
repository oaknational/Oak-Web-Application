export const pickQuizNavigationButtonLabel = ({
  currentQuestionIndex,
  numQuestions,
  currentSection,
}: {
  currentQuestionIndex: number;
  numQuestions: number;
  currentSection: "starter-quiz" | "exit-quiz";
}) => {
  if (currentQuestionIndex + 1 !== numQuestions) {
    return "Next question";
  }

  return currentSection === "exit-quiz" ? "Lesson review" : "Continue lesson";
};
