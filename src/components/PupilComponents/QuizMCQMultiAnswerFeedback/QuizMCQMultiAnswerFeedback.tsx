import { OakSpan } from "@oaknational/oak-components";

import { useQuizEngineContext } from "../QuizEngineProvider";
import { isText } from "../QuizUtils/stemUtils";

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
