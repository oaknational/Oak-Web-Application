import { OakCodeRenderer, OakSpan } from "@oaknational/oak-components";
import { isString } from "lodash";

import { QuestionState } from "@/components/PupilComponents/QuizUtils/questionTypes";

type Props = {
  questionState?: QuestionState;
};

export const QuizCorrectAnswers = ({ questionState }: Props) => {
  const feedbackText = (() => {
    switch (true) {
      case questionState &&
        Array.isArray(questionState.correctAnswer) &&
        Object.prototype.hasOwnProperty.call(
          questionState.correctAnswer[0],
          "imageObject",
        ):
        return null;
      case questionState &&
        Array.isArray(questionState.correctAnswer) &&
        questionState.correctAnswer.length > 1:
        return (
          "Correct answers: " +
          (
            questionState.correctAnswer.filter(
              (answer) => isString(answer) && answer?.trim() !== "",
            ) as string[]
          ).join(", ")
        );
      case questionState && Array.isArray(questionState.correctAnswer):
        return (
          "Correct answer: " +
          questionState.correctAnswer.filter((answer) => isString(answer))[0]
        );
      case questionState && typeof questionState.correctAnswer === "string":
        return `Correct answer: ${questionState.correctAnswer}`;
      default:
        return null;
    }
  })();

  if (!feedbackText) return null;

  return (
    <OakSpan $color="text-primary" $font="body-2">
      <OakCodeRenderer string={feedbackText} $font="code-3" />
    </OakSpan>
  );
};
