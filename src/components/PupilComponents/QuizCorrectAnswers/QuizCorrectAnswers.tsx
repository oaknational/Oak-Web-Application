import { OakCodeRenderer, OakSpan } from "@oaknational/oak-components";
import { isString } from "lodash";

import { useQuizEngineContext } from "@/components/PupilComponents/QuizEngineProvider";

export const QuizCorrectAnswers = () => {
  const quizEngineContext = useQuizEngineContext();
  const { currentQuestionState } = quizEngineContext;

  const feedbackText = (() => {
    switch (true) {
      case currentQuestionState &&
        Array.isArray(currentQuestionState.correctAnswer) &&
        Object.prototype.hasOwnProperty.call(
          currentQuestionState.correctAnswer[0],
          "imageObject",
        ):
        return null;
      case currentQuestionState &&
        Array.isArray(currentQuestionState.correctAnswer) &&
        currentQuestionState.correctAnswer.length > 1:
        return (
          "Correct answers: " +
          currentQuestionState.correctAnswer
            .filter((answer) => isString(answer))
            .join(", ")
        );
      case currentQuestionState &&
        Array.isArray(currentQuestionState.correctAnswer):
        return (
          "Correct answer: " +
          currentQuestionState.correctAnswer.filter((answer) =>
            isString(answer),
          )[0]
        );
      case currentQuestionState && Boolean(currentQuestionState.correctAnswer):
        return "Correct answer: " + currentQuestionState.correctAnswer;
      default:
        return null;
    }
  })();

  if (feedbackText !== null) {
    return (
      <OakSpan $color={"text-primary"} $font={"body-2"}>
        <OakCodeRenderer string={feedbackText} $font={"code-3"} />
      </OakSpan>
    );
  }

  return null;
};
