import {
  isMultiAnswerMCQ,
  isShortAnswer,
  isSingleAnswerMCQ,
} from "./answerTypeDiscriminators";

import { AnswersSchema } from "@/node-lib/curriculum-api-2023/shared.schema";
import { QuizMCQMultiAnswer } from "@/components/PupilJourneyComponents/QuizMCQMultiAnswer";
import { QuizMCQSingleAnswer } from "@/components/PupilJourneyComponents/QuizMCQSingleAnswer";
import { QuizShortAnswer } from "@/components/PupilJourneyComponents/QuizShortAnswer";

export const pickAnswerComponent = (answers: AnswersSchema) => {
  switch (true) {
    case isMultiAnswerMCQ(answers):
      return QuizMCQMultiAnswer;
    case isSingleAnswerMCQ(answers):
      return QuizMCQSingleAnswer;
    case isShortAnswer(answers):
      return QuizShortAnswer;
    default:
      return null;
  }
};
