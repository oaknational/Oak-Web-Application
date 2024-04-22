import { QuizMCQMultiAnswerFeedback } from "../QuizMCQMultiAnswerFeedback";
import { QuizMCQSingleAnswerFeedback } from "../QuizMCQSingleAnswerFeedback";
import { QuizOrderAnswerFeedback } from "../QuizOrderAnswerFeedback/QuizOrderAnswerFeedback";
import { QuizShortAnswerFeedback } from "../QuizShortAnswerFeedback";

import { pickFeedBackComponent } from "./pickFeedback";

import { orderAnswers } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";
import { QuizQuestionAnswers } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";

describe("pickFeedbackComponent", () => {
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
