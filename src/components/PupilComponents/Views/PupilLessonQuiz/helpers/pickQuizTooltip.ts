import {
  isMatchAnswer,
  isMultiAnswerMCQ,
  isOrderAnswer,
  isShortAnswer,
  isSingleAnswerMCQ,
} from "@/components/PupilComponents/QuizUtils/answerTypeDiscriminators";
import { QuizQuestionAnswers } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";

export function pickQuizTooltip(answers: QuizQuestionAnswers) {
  switch (true) {
    case isOrderAnswer(answers):
      return "You need to order to move on!";
    case isMatchAnswer(answers):
      return "You need to match to move on!";
    case isShortAnswer(answers):
      return "You need to type an answer to move on!";
    case isMultiAnswerMCQ(answers):
      return "You need to select answers to move on!";
    case isSingleAnswerMCQ(answers):
      return "You need to select an answer to move on!";
  }
}
