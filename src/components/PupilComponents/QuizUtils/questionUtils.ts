import { LessonOverviewQuizData } from "@/node-lib/curriculum-api-2023/shared.schema";

export const getInteractiveQuestions = (questions: LessonOverviewQuizData) =>
  questions?.length
    ? questions.filter(
        (question) => question.questionType !== "explanatory-text",
      )
    : [];
