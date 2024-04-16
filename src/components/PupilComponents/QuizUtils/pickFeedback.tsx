import { QuizMCQMultiAnswerFeedback } from "../QuizMCQMultiAnswerFeedback";
import { QuizMCQSingleAnswerFeedback } from "../QuizMCQSingleAnswerFeedback";
import { QuizOrderAnswerFeedback } from "../QuizOrderAnswerFeedback/QuizOrderAnswerFeedback";
import { QuizShortAnswerFeedback } from "../QuizShortAnswerFeedback";

import {
  isMultiAnswerMCQ,
  isOrderAnswer,
  isShortAnswer,
  isSingleAnswerMCQ,
} from "./answerTypeDiscriminators";

import { QuizQuestionAnswers } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";

export const pickFeedBackComponent = (answers: QuizQuestionAnswers) => {
  switch (true) {
    case isMultiAnswerMCQ(answers):
      return <QuizMCQMultiAnswerFeedback />;
    case isSingleAnswerMCQ(answers):
      return <QuizMCQSingleAnswerFeedback />;
    case isShortAnswer(answers):
      return <QuizShortAnswerFeedback />;
    case isOrderAnswer(answers):
      return <QuizOrderAnswerFeedback />;
    default:
      return null;
  }
};
