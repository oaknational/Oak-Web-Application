// these discriminators should probably be moved outside of the components folder so that they can be consumed across the app

import {
  QuizQuestionAnswers,
  MCAnswer,
  MatchAnswer,
  OrderAnswer,
  ShortAnswer,
} from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";

export const isMultiAnswerMCQ = (
  answers: QuizQuestionAnswers,
): answers is { "multiple-choice": MCAnswer[] } => {
  const answerCount =
    answers["multiple-choice"]?.filter((a) => a?.answerIsCorrect).length ?? 0;

  return answerCount > 1;
};

export const isSingleAnswerMCQ = (
  answers: QuizQuestionAnswers,
): answers is { "multiple-choice": MCAnswer[] } => {
  const answerCount =
    answers["multiple-choice"]?.filter((a) => a?.answerIsCorrect).length ?? 0;

  return answerCount === 1;
};

export const isShortAnswer = (
  answers: QuizQuestionAnswers,
): answers is { "short-answer": ShortAnswer[] } => {
  return !!answers["short-answer"];
};

export const isOrderAnswer = (
  answers: QuizQuestionAnswers,
): answers is { order: OrderAnswer[] } => {
  return !!answers["order"];
};

export const isMatchAnswer = (
  answers: QuizQuestionAnswers,
): answers is { match: MatchAnswer[] } => {
  return !!answers["match"];
};
