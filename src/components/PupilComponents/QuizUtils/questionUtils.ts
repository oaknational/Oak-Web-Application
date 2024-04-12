import { QuizQuestion } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";

export const getInteractiveQuestions = (questions?: QuizQuestion[]) =>
  questions?.length
    ? questions.filter(
        (question) => question.questionType !== "explanatory-text",
      )
    : [];
