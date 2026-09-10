export const pickQuizFeedbackState = (
  isCorrect: boolean,
  isPartiallyCorrect?: boolean,
) => {
  switch (true) {
    case isCorrect:
      return "correct";
    case !isCorrect && !isPartiallyCorrect:
      return "incorrect";
    case !isCorrect && isPartiallyCorrect:
      return "partially-correct";
    default:
      return null;
  }
};
