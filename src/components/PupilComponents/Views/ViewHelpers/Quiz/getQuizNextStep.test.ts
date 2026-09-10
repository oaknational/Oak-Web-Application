import { getQuizNextStep } from "./getQuizNextStep";

describe("getQuizNextStep", () => {
  it("moves to the next question before the final question", () => {
    expect(
      getQuizNextStep({
        currentQuestionIndex: 0,
        numQuestions: 3,
        isReadOnly: false,
      }),
    ).toEqual({ action: "next-question" });
  });

  it("completes the quiz on the final question", () => {
    expect(
      getQuizNextStep({
        currentQuestionIndex: 2,
        numQuestions: 3,
        isReadOnly: false,
      }),
    ).toEqual({ action: "complete-quiz" });
  });

  it("goes to review for read-only quizzes before the final question", () => {
    expect(
      getQuizNextStep({
        currentQuestionIndex: 0,
        numQuestions: 3,
        isReadOnly: true,
      }),
    ).toEqual({ action: "go-review" });
  });

  it("goes to review for read-only quizzes on the final question", () => {
    expect(
      getQuizNextStep({
        currentQuestionIndex: 2,
        numQuestions: 3,
        isReadOnly: true,
      }),
    ).toEqual({ action: "go-review" });
  });
});
