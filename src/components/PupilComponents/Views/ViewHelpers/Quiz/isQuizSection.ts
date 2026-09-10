export type QuizSection = "starter-quiz" | "exit-quiz";

export const isQuizSection = (section: string): section is QuizSection => {
  return section === "starter-quiz" || section === "exit-quiz";
};
