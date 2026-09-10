import { pickQuizTooltip } from "./pickQuizTooltip";

import {
  matchAnswers,
  mcqCorrectAnswer,
  mcqIncorrectAnswer,
  orderAnswers,
  shortAnswers,
} from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";
import { QuizQuestionAnswers } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";

describe("pickQuizTooltip", () => {
  const tooltipCases: [QuizQuestionAnswers, string][] = [
    [{ order: orderAnswers }, "You need to order to move on!"],
    [{ match: matchAnswers }, "You need to match to move on!"],
    [
      { "short-answer": shortAnswers },
      "You need to type an answer to move on!",
    ],
    [
      { "multiple-choice": [mcqCorrectAnswer, { ...mcqCorrectAnswer }] },
      "You need to select answers to move on!",
    ],
    [
      { "multiple-choice": [mcqIncorrectAnswer, mcqCorrectAnswer] },
      "You need to select an answer to move on!",
    ],
  ];

  it.each(tooltipCases)("returns the tooltip for %s", (answers, expected) => {
    expect(pickQuizTooltip(answers)).toBe(expected);
  });

  it("returns undefined for an unsupported answer shape", () => {
    expect(pickQuizTooltip({} as never)).toBeUndefined();
  });
});
