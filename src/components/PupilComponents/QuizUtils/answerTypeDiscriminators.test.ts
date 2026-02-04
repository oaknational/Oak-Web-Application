import { isMultiAnswerMCQ, isShortAnswer } from "./answerTypeDiscriminators";

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

  describe("isMultiAnswerMCQ", () => {
    it("should return true if there are more than one correct answers", () => {
      const result = isMultiAnswerMCQ(multiAnswer);
      expect(result).toBe(true);
    });
    it("should return false if there is one correct answer", () => {
      const result = isMultiAnswerMCQ(singleAnswer);
      expect(result).toBe(false);
    });
  });
  describe("isSingleAnswerMCQ", () => {
    it("should return true if there is one correct answer", () => {
      const result = isMultiAnswerMCQ(singleAnswer);
      expect(result).toBe(false);
    });
    it("should return false if there are more than one correct answers", () => {
      const result = isMultiAnswerMCQ(multiAnswer);
      expect(result).toBe(true);
    });
  });
  describe("isShortAnswer", () => {
    it("should return true if there is a short answer", () => {
      const result = isShortAnswer(shortAnswer);
      expect(result).toBe(true);
    });
    it("should return false if there is no short answer", () => {
      const result = isShortAnswer(multiAnswer);
      expect(result).toBe(false);
    });
  });
});
