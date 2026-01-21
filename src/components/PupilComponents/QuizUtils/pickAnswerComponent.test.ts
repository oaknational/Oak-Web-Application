import { pickAnswerComponent } from "./pickAnswerComponent";

import { QuizMCQMultiAnswer } from "@/components/PupilComponents/QuizMCQMultiAnswer";
import { QuizMCQSingleAnswer } from "@/components/PupilComponents/QuizMCQSingleAnswer";
import { QuizShortAnswer } from "@/components/PupilComponents/QuizShortAnswer";
import { AnswersSchema } from "@/node-lib/curriculum-api-2023/shared.schema";

describe("pickAnswerComponent", () => {
  const multiAnswer: AnswersSchema = {
    "multiple-choice": [
      {
        answerIsCorrect: true,
      },
      {
        answerIsCorrect: true,
      },
    ],
  } as AnswersSchema;

  const singleAnswer: AnswersSchema = {
    "multiple-choice": [
      {
        answerIsCorrect: true,
      },
      {
        answerIsCorrect: false,
      },
    ],
  } as AnswersSchema;

  const shortAnswer: AnswersSchema = {
    "short-answer": [{}],
  } as AnswersSchema;

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
