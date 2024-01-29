import { OakSpan } from "@oaknational/oak-components";

import { useQuizEngineContext } from "../QuizEngineProvider";
import { isText } from "../QuizUtils/stemUtils";

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
