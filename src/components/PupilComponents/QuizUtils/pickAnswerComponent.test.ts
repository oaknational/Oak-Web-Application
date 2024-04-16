import { pickAnswerComponent } from "./pickAnswerComponent";

import { QuizMCQMultiAnswer } from "@/components/PupilComponents/QuizMCQMultiAnswer";
import { QuizMCQSingleAnswer } from "@/components/PupilComponents/QuizMCQSingleAnswer";
import { QuizShortAnswer } from "@/components/PupilComponents/QuizShortAnswer";
import { QuizQuestionAnswers } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";

describe("pickAnswerComponent", () => {
  const multiAnswer: QuizQuestionAnswers = {
    "multiple-choice": [
      {
        answerIsCorrect: true,
      },
      {
        answerIsCorrect: true,
      },
    ],
  } as QuizQuestionAnswers;

  const singleAnswer: QuizQuestionAnswers = {
    "multiple-choice": [
      {
        answerIsCorrect: true,
      },
      {
        answerIsCorrect: false,
      },
    ],
  } as QuizQuestionAnswers;

  const shortAnswer: QuizQuestionAnswers = {
    "short-answer": [{}],
  } as QuizQuestionAnswers;

  describe("pickAnswerComponent", () => {
    it("should return QuizMCQMultiAnswer if isMultiAnswerMCQ is true", () => {
      const result = pickAnswerComponent(multiAnswer);
      expect(result).toBe(QuizMCQMultiAnswer);
    });
    it("should return QuizMCQSingleAnswer if isSingleAnswerMCQ is true", () => {
      const result = pickAnswerComponent(singleAnswer);
      expect(result).toBe(QuizMCQSingleAnswer);
    });
    it("should return QuizShortAnswer if isShortAnswer is true", () => {
      const result = pickAnswerComponent(shortAnswer);
      expect(result).toBe(QuizShortAnswer);
    });
    it("should return null if all are false", () => {
      const result = pickAnswerComponent({});
      expect(result).toBe(null);
    });
  });
});
