import { QuizOrderAnswer } from "../QuizOrderAnswer";
import { QuizMatchAnswer } from "../QuizMatchAnswer";

import {
  isMatchAnswer,
  isMultiAnswerMCQ,
  isOrderAnswer,
  isShortAnswer,
  isSingleAnswerMCQ,
} from "./answerTypeDiscriminators";

import { AnswersSchema } from "@/node-lib/curriculum-api-2023/shared.schema";
import { QuizMCQMultiAnswer } from "@/components/PupilComponents/QuizMCQMultiAnswer";
import { QuizMCQSingleAnswer } from "@/components/PupilComponents/QuizMCQSingleAnswer";
import { QuizShortAnswer } from "@/components/PupilComponents/QuizShortAnswer";

export const pickAnswerComponent = (answers: AnswersSchema) => {
  switch (true) {
    case isMultiAnswerMCQ(answers):
      return QuizMCQMultiAnswer;
    case isSingleAnswerMCQ(answers):
      return QuizMCQSingleAnswer;
    case isShortAnswer(answers):
      return QuizShortAnswer;
    case isOrderAnswer(answers):
      return QuizOrderAnswer;
    case isMatchAnswer(answers):
      return QuizMatchAnswer;
    default:
      return null;
  }
};
