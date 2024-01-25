import { OakSpan } from "@oak-academy/oak-components";

import { useQuizEngineContext } from "../QuizEngineProvider";

import {
  isMultiAnswerMCQ,
  isShortAnswer,
  isSingleAnswerMCQ,
} from "./answerTypeDiscriminators";
import { isText } from "./stemUtils";

import { AnswersSchema } from "@/node-lib/curriculum-api-2023/shared.schema";

export const QuizMCQSingleAnswerFeedback = () => {
  const quizEngineContext = useQuizEngineContext();
  const { currentQuestionData } = quizEngineContext;
  const correctAnswer = currentQuestionData?.answers?.[
    "multiple-choice"
  ]?.filter((answer) => answer.answer_is_correct);
  const label = correctAnswer?.[0]?.answer?.find(isText);
  return (
    <OakSpan $color={"text-primary"} $font={"body-2"}>
      Correct answer: {label?.text}
    </OakSpan>
  );
};

export const QuizMCQMultiAnswerFeedback = () => {
  const quizEngineContext = useQuizEngineContext();
  const { currentQuestionData } = quizEngineContext;
  const correctAnswers = currentQuestionData?.answers?.[
    "multiple-choice"
  ]?.filter((answer) => answer.answer_is_correct);
  const labels = correctAnswers?.map((answer) => answer.answer?.find(isText));
  return (
    <OakSpan $color={"text-primary"} $font={"body-2"}>
      Correct answers: {labels?.map((label) => label?.text).join(", ")}
    </OakSpan>
  );
};

export const QuizShortAnswerFeedback = () => {
  const quizEngineContext = useQuizEngineContext();
  const { currentQuestionData } = quizEngineContext;
  const correctAnswers = currentQuestionData?.answers?.["short-answer"];
  const labels = correctAnswers?.map((answer) => answer.answer?.find(isText));
  return (
    <OakSpan $color={"text-primary"} $font={"body-2"}>
      Correct answers: {labels?.map((label) => label?.text).join(", ")}
    </OakSpan>
  );
};

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
