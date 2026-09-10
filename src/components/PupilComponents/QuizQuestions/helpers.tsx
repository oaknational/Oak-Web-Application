import {
  OakQuizMatchItemId,
  OakQuizOrderitemId,
} from "@oaknational/oak-components";

import {
  isMatchAnswer,
  isMultiAnswerMCQ,
  isOrderAnswer,
  isShortAnswer,
  isSingleAnswerMCQ,
} from "@/components/PupilComponents/QuizUtils/answerTypeDiscriminators";
import { QuizQuestionAnswers } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";

export const multipleChoiceAnswerId = (
  questionUid: string | undefined,
  index: number,
) => `${questionUid}-answer-${index}`;

export const shortAnswerInputId = (questionUid: string | undefined) =>
  `short-answer-${questionUid}`;

export const pickQuizTabId = (
  answers: QuizQuestionAnswers,
  questionUid: string | undefined,
) => {
  switch (true) {
    case isOrderAnswer(answers):
      return OakQuizOrderitemId("1");
    case isMatchAnswer(answers):
      return OakQuizMatchItemId("0");
    case isShortAnswer(answers):
      return shortAnswerInputId(questionUid);
    case isMultiAnswerMCQ(answers):
      return multipleChoiceAnswerId(questionUid, 0);
    case isSingleAnswerMCQ(answers):
      return multipleChoiceAnswerId(questionUid, 0);
  }
};
