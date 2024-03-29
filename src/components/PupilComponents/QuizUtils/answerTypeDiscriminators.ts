// these discriminators should probably be moved outside of the components folder so that they can be consumed across the app

import {
  AnswersSchema,
  MCAnswer,
  MatchAnswer,
  OrderAnswer,
  ShortAnswer,
} from "@/node-lib/curriculum-api-2023/shared.schema";

export const isMultiAnswerMCQ = (
  answers: AnswersSchema,
): answers is { "multiple-choice": MCAnswer[] } => {
  const answerCount =
    answers["multiple-choice"]?.filter((a) => a.answer_is_correct).length ?? 0;

  return answerCount > 1;
};

export const isSingleAnswerMCQ = (
  answers: AnswersSchema,
): answers is { "multiple-choice": MCAnswer[] } => {
  const answerCount =
    answers["multiple-choice"]?.filter((a) => a.answer_is_correct).length ?? 0;

  return answerCount === 1;
};

export const isShortAnswer = (
  answers: AnswersSchema,
): answers is { "short-answer": ShortAnswer[] } => {
  return !!answers["short-answer"];
};

export const isOrderAnswer = (
  answers: AnswersSchema,
): answers is { order: OrderAnswer[] } => {
  return !!answers["order"];
};

export const isMatchAnswer = (
  answers: AnswersSchema,
): answers is { match: MatchAnswer[] } => {
  return !!answers["match"];
};
