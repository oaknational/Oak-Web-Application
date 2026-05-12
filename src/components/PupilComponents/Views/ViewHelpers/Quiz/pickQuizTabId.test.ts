import {
  OakQuizMatchItemId,
  OakQuizOrderitemId,
} from "@oaknational/oak-components";

import { pickQuizTabId } from "./pickQuizTabId";

import { multipleChoiceAnswerId } from "@/components/PupilComponents/QuizMCQMultiAnswer";
import { shortAnswerInputId } from "@/components/PupilComponents/QuizShortAnswer";
import {
  matchAnswers,
  mcqCorrectAnswer,
  mcqIncorrectAnswer,
  orderAnswers,
  shortAnswers,
} from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";

describe("pickQuizTabId", () => {
  it("returns the first order tab id", () => {
    expect(pickQuizTabId({ order: orderAnswers }, "Q1")).toBe(
      OakQuizOrderitemId("1"),
    );
  });

  it("returns the first match tab id", () => {
    expect(pickQuizTabId({ match: matchAnswers }, "Q1")).toBe(
      OakQuizMatchItemId("0"),
    );
  });

  it("returns the short answer input id", () => {
    expect(pickQuizTabId({ "short-answer": shortAnswers }, "Q1")).toBe(
      shortAnswerInputId("Q1"),
    );
  });

  it("returns the first multiple choice answer id for single and multi answer questions", () => {
    expect(
      pickQuizTabId(
        { "multiple-choice": [mcqIncorrectAnswer, mcqCorrectAnswer] },
        "Q1",
      ),
    ).toBe(multipleChoiceAnswerId("Q1", 0));
    expect(
      pickQuizTabId(
        {
          "multiple-choice": [
            mcqCorrectAnswer,
            { ...mcqCorrectAnswer },
            mcqIncorrectAnswer,
          ],
        },
        "Q1",
      ),
    ).toBe(multipleChoiceAnswerId("Q1", 0));
  });

  it("returns undefined for an unsupported answer shape", () => {
    expect(pickQuizTabId({} as never, "Q1")).toBeUndefined();
  });
});
