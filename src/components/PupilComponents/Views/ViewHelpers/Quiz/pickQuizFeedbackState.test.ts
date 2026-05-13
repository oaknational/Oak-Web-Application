import { pickQuizFeedbackState } from "./pickQuizFeedbackState";

describe("pickQuizFeedbackState", () => {
  it.each([
    [true, undefined, "correct"],
    [false, false, "incorrect"],
    [false, true, "partially-correct"],
  ] as const)(
    "returns %s for correct=%s and partiallyCorrect=%s",
    (isCorrect, isPartiallyCorrect, expected) => {
      expect(pickQuizFeedbackState(isCorrect, isPartiallyCorrect)).toBe(
        expected,
      );
    },
  );
});
