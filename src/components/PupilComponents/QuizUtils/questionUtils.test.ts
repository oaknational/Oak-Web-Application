import { getInteractiveQuestions } from "./questionUtils";

import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";
import { QuizQuestion } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";

describe("questionUtils", () => {
  describe("getInteractiveQuestions", () => {
    const explanatoryTextQuestion: QuizQuestion = {
      questionId: 1,
      questionUid: "1",
      questionStem: [],
      questionType: "explanatory-text",
      feedback: "Feedback",
      hint: "Hint",
      active: true,
      order: 0,
    };

    it("should return an empty array if no questions are provided", () => {
      const result = getInteractiveQuestions(undefined);
      expect(result).toEqual([]);
    });

    it("should return an empty array if no questions are interactive", () => {
      const result = getInteractiveQuestions([explanatoryTextQuestion]);
      expect(result).toEqual([]);
    });

    it("should return all interactive questions", () => {
      const result = getInteractiveQuestions(quizQuestions);
      expect(result.length).toEqual(quizQuestions.length);
    });

    it("should not return explanatory text questions", () => {
      const result = getInteractiveQuestions([
        ...quizQuestions,
        explanatoryTextQuestion,
      ]);
      expect(result.length).toEqual(quizQuestions.length);
    });
  });
});
