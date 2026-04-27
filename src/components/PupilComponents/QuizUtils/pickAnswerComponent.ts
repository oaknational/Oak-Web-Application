import {
  isMatchAnswer,
  isMultiAnswerMCQ,
  isOrderAnswer,
  isShortAnswer,
  isSingleAnswerMCQ,
} from "./answerTypeDiscriminators";

import { QuizOrderAnswer } from "@/components/PupilComponents/LegacyQuiz/QuizOrderAnswer";
import { QuizMatchAnswer } from "@/components/PupilComponents/LegacyQuiz/QuizMatchAnswer";
import { QuizMCQMultiAnswer } from "@/components/PupilComponents/LegacyQuiz/QuizMCQMultiAnswer";
import { QuizMCQSingleAnswer } from "@/components/PupilComponents/LegacyQuiz/QuizMCQSingleAnswer";
import { QuizShortAnswer } from "@/components/PupilComponents/LegacyQuiz/QuizShortAnswer";
import { QuizQuestionAnswers } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";

// Remove this when we remove the legacy pupil experience.
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
