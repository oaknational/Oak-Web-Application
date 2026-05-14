import { getInteractiveQuestions } from "./getInteractiveQuestions";

import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";
import { QuizQuestion } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";

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
    _state: "published",
  };

  it("returns an empty array when questions are missing", () => {
    expect(getInteractiveQuestions()).toEqual([]);
  });

  it("filters out explanatory text questions", () => {
    expect(
      getInteractiveQuestions([...quizQuestions, explanatoryTextQuestion]),
    ).toEqual(quizQuestions);
  });
});
