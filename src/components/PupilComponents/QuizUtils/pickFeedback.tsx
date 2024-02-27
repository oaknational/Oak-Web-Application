import { QuizMCQMultiAnswerFeedback } from "../QuizMCQMultiAnswerFeedback";
import { QuizMCQSingleAnswerFeedback } from "../QuizMCQSingleAnswerFeedback";
import { QuizShortAnswerFeedback } from "../QuizShortAnswerFeedback";

import {
  isMultiAnswerMCQ,
  isShortAnswer,
  isSingleAnswerMCQ,
} from "./answerTypeDiscriminators";

import { AnswersSchema } from "@/node-lib/curriculum-api-2023/shared.schema";

export const pickFeedBackComponent = (answers: AnswersSchema) => {
  switch (true) {
    case isMultiAnswerMCQ(answers):
      return <QuizMCQMultiAnswerFeedback />;
    case isSingleAnswerMCQ(answers):
      return <QuizMCQSingleAnswerFeedback />;
    case isShortAnswer(answers):
      return <QuizShortAnswerFeedback />;
    default:
      return null;
  }
};
