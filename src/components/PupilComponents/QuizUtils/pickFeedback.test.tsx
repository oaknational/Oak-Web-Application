import {
  QuizMCQMultiAnswerFeedback,
  QuizMCQSingleAnswerFeedback,
  QuizShortAnswerFeedback,
  pickFeedBackComponent,
} from "./pickFeedback";

import { AnswersSchema } from "@/node-lib/curriculum-api-2023/shared.schema";

describe("pickFeedbackComponent", () => {
  const multiAnswer: AnswersSchema = {
    "multiple-choice": [
      {
        answer_is_correct: true,
      },
      {
        answer_is_correct: true,
      },
    ],
  } as AnswersSchema;

  const singleAnswer: AnswersSchema = {
    "multiple-choice": [
      {
        answer_is_correct: true,
      },
      {
        answer_is_correct: false,
      },
    ],
  } as AnswersSchema;

  const shortAnswer: AnswersSchema = {
    "short-answer": [{}],
  } as AnswersSchema;

  describe("pickFeedbackComponent", () => {
    it("should return QuizMCQMultiAnswer if isMultiAnswerMCQ is true", () => {
      const result = pickFeedBackComponent(multiAnswer);
      expect(result).toStrictEqual(<QuizMCQMultiAnswerFeedback />);
    });
    it("should return QuizMCQSingleAnswer if isSingleAnswerMCQ is true", () => {
      const result = pickFeedBackComponent(singleAnswer);
      expect(result).toStrictEqual(<QuizMCQSingleAnswerFeedback />);
    });
    it("should return QuizShortAnswer if isShortAnswer is true", () => {
      const result = pickFeedBackComponent(shortAnswer);
      expect(result).toStrictEqual(<QuizShortAnswerFeedback />);
    });
    it("should return null if all are false", () => {
      const result = pickFeedBackComponent({});
      expect(result).toBe(null);
    });
  });
});
