import { QuizOrderAnswer } from "../QuizOrderAnswer";
import { QuizMatchAnswer } from "../QuizMatchAnswer";

import {
  isMatchAnswer,
  isMultiAnswerMCQ,
  isOrderAnswer,
  isShortAnswer,
  isSingleAnswerMCQ,
} from "./answerTypeDiscriminators";

import { QuizMCQMultiAnswer } from "@/components/PupilComponents/QuizMCQMultiAnswer";
import { QuizMCQSingleAnswer } from "@/components/PupilComponents/QuizMCQSingleAnswer";
import { QuizShortAnswer } from "@/components/PupilComponents/QuizShortAnswer";
import { QuizQuestionAnswers } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";

export const pickAnswerComponent = (answers: QuizQuestionAnswers) => {
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
