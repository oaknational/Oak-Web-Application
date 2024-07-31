import { OakSpan } from "@oaknational/oak-components";

import { useQuizEngineContext } from "@/components/PupilComponents/QuizEngineProvider";

export const QuizCorrectAnswers = () => {
  const quizEngineContext = useQuizEngineContext();
  const { currentQuestionState } = quizEngineContext;

  const feedbackText = (() => {
    switch (true) {
      case currentQuestionState &&
        Array.isArray(currentQuestionState.correctAnswer) &&
        currentQuestionState.correctAnswer.length > 1:
        return (
          "Correct answers: " + currentQuestionState.correctAnswer.join(", ")
        );
      case currentQuestionState &&
        Array.isArray(currentQuestionState.correctAnswer):
        return "Correct answer: " + currentQuestionState.correctAnswer[0];
      case currentQuestionState && Boolean(currentQuestionState.correctAnswer):
        return "Correct answer: " + currentQuestionState.correctAnswer;
      default:
        return null;
    }
  })();

  if (feedbackText !== null) {
    return (
      <OakSpan $color={"text-primary"} $font={"body-2"}>
        {feedbackText}
      </OakSpan>
    );
  }

  return null;
};
