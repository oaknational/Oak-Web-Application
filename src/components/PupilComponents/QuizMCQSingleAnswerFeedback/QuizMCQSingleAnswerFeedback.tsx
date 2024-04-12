import { OakSpan } from "@oaknational/oak-components";

import { useQuizEngineContext } from "@/components/PupilComponents/QuizEngineProvider";
import { isText } from "@/components/PupilComponents/QuizUtils/stemUtils";

export const QuizMCQSingleAnswerFeedback = () => {
  const quizEngineContext = useQuizEngineContext();
  const { currentQuestionData } = quizEngineContext;
  const correctAnswer = currentQuestionData?.answers?.[
    "multiple-choice"
  ]?.filter((answer) => answer.answerIsCorrect);
  const label = correctAnswer?.[0]?.answer?.find(isText);
  if (label)
    return (
      <OakSpan $color={"text-primary"} $font={"body-2"}>
        Correct answer: {label.text}
      </OakSpan>
    );
  return null;
};
