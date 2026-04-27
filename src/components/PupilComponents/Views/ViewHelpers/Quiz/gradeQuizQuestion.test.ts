import {
  gradeMatchQuestion,
  gradeMultipleChoiceQuestion,
  gradeOrderQuestion,
  gradeShortAnswerQuestion,
} from "./gradeQuizQuestion";

import { createQuestionData } from "@/components/PupilComponents/pupilTestHelpers/createQuizEngineContext";
import {
  matchAnswers,
  orderAnswers,
  quizQuestions,
} from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";

describe("gradeQuizQuestion helpers", () => {
  it("grades a multiple choice answer and marks partially correct state", () => {
    const questionData = structuredClone(quizQuestions[0]);
    questionData!.answers!["multiple-choice"]![0]!.answerIsCorrect = true;

    const result = gradeMultipleChoiceQuestion({
      questionData: questionData as never,
      pupilAnswer: [
        questionData!.answers!["multiple-choice"]![0]!,
        questionData!.answers!["multiple-choice"]![1]!,
      ],
    });

    expect(result.grade).toBe(0);
    expect(result.isPartiallyCorrect).toBe(true);
    expect(result.feedback).toEqual([
      "correct",
      "incorrect",
      "incorrect",
      "correct",
    ]);
  });

  it("grades short answers case-insensitively", () => {
    const questionData = quizQuestions.find(
      (question) => question.questionType === "short-answer",
    );

    const result = gradeShortAnswerQuestion({
      questionData: questionData as never,
      pupilAnswer: " Earth ",
    });

    expect(result.feedback).toBe("correct");
    expect(result.grade).toBe(1);
  });

  it("grades order questions", () => {
    const questionData = createQuestionData({
      answers: { order: orderAnswers },
      questionType: "order",
    });

    const result = gradeOrderQuestion({
      questionData,
      pupilAnswers: [1, 4, 3, 2],
    });

    expect(result.grade).toBe(0);
    expect(result.isPartiallyCorrect).toBe(true);
    expect(result.feedback).toEqual([
      "correct",
      "incorrect",
      "correct",
      "incorrect",
    ]);
  });

  it("grades match questions", () => {
    const questionData = createQuestionData({
      answers: { match: matchAnswers },
      questionType: "match",
    });

    const result = gradeMatchQuestion({
      questionData,
      matches: ["0", "1", "2"],
      choices: ["2", "1", "0"],
    });

    expect(result.grade).toBe(0);
    expect(result.isPartiallyCorrect).toBe(true);
    expect(result.feedback).toEqual(["incorrect", "correct", "incorrect"]);
  });
});

function structuredClone<T>(incoming: T): T {
  return JSON.parse(JSON.stringify(incoming));
}
