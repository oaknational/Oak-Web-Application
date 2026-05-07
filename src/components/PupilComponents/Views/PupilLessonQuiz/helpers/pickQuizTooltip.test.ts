import { pickQuizTooltip } from "./pickQuizTooltip";

import { QuizQuestionAnswers } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";

describe("pickQuizTooltip", () => {
  it.each([
    [{ order: [{}] }, "You need to order to move on!"],
    [{ match: [{}] }, "You need to match to move on!"],
    [{ "short-answer": [{}] }, "You need to type an answer to move on!"],
    [
      {
        "multiple-choice": [
          { answerIsCorrect: true },
          { answerIsCorrect: true },
        ],
      },
      "You need to select answers to move on!",
    ],
    [
      {
        "multiple-choice": [
          { answerIsCorrect: true },
          { answerIsCorrect: false },
        ],
      },
      "You need to select an answer to move on!",
    ],
  ] as Array<[QuizQuestionAnswers, string]>)(
    "returns the right tooltip for %s",
    (answers, expected) => {
      expect(pickQuizTooltip(answers)).toBe(expected);
    },
  );

  it("returns undefined when there is no recognised answer type", () => {
    expect(pickQuizTooltip({})).toBeUndefined();
  });
});
