import { pickQuizNavigationButtonLabel } from "./pickQuizNavigationButtonLabel";

describe("pickQuizNavigationButtonLabel", () => {
  it("returns next question when there are more questions", () => {
    expect(
      pickQuizNavigationButtonLabel({
        currentQuestionIndex: 0,
        numQuestions: 3,
        currentSection: "starter-quiz",
      }),
    ).toBe("Next question");
  });

  it("returns continue lesson at the end of starter quiz", () => {
    expect(
      pickQuizNavigationButtonLabel({
        currentQuestionIndex: 2,
        numQuestions: 3,
        currentSection: "starter-quiz",
      }),
    ).toBe("Continue lesson");
  });

  it("returns lesson review at the end of exit quiz", () => {
    expect(
      pickQuizNavigationButtonLabel({
        currentQuestionIndex: 2,
        numQuestions: 3,
        currentSection: "exit-quiz",
      }),
    ).toBe("Lesson review");
  });
});
