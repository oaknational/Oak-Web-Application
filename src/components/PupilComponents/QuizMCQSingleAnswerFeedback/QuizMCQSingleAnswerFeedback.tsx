import { OakSpan } from "@oaknational/oak-components";

import { useQuizEngineContext } from "../QuizEngineProvider";
import { isText } from "../QuizUtils/stemUtils";

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
