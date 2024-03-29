import { QuizMCQMultiAnswerFeedback } from "../QuizMCQMultiAnswerFeedback";
import { QuizMCQSingleAnswerFeedback } from "../QuizMCQSingleAnswerFeedback";
import { QuizOrderAnswerFeedback } from "../QuizOrderAnswerFeedback/QuizOrderAnswerFeedback";
import { QuizShortAnswerFeedback } from "../QuizShortAnswerFeedback";

import { pickFeedBackComponent } from "./pickFeedback";

import { orderAnswers } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";
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

    it("should return QuizShortAnswer if isOrderAnswer is true", () => {
      const result = pickFeedBackComponent({ order: orderAnswers });
      expect(result).toStrictEqual(<QuizOrderAnswerFeedback />);
    });

    it("should return null if all are false", () => {
      const result = pickFeedBackComponent({});
      expect(result).toBe(null);
    });
  });
});
