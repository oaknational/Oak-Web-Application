import { mapPupilQuizResultsForAnalytics } from "./mapPupilQuizResultsForAnalytics";

describe("mapPupilQuizResultsForAnalytics", () => {
  it("returns undefined when there are no question results", () => {
    expect(
      mapPupilQuizResultsForAnalytics({
        section: "starter-quiz",
        questionResults: undefined,
        questionsArray: [],
      }),
    ).toBeUndefined();
  });

  it("maps question results into lesson summary analytics results", () => {
    expect(
      mapPupilQuizResultsForAnalytics({
        section: "starter-quiz",
        questionResults: [
          { grade: 1, offerHint: false },
          { grade: 0, offerHint: true },
        ],
        questionsArray: [
          {
            questionType: "multiple-choice",
            hint: "Hint",
          } as never,
          {
            questionType: "short-answer",
            hint: null,
          } as never,
        ],
      }),
    ).toEqual([
      {
        pupilExperienceLessonActivity: "starter-quiz",
        questionNumber: 1,
        questionType: "multiple-choice",
        questionResult: "correct",
        hintOffered: true,
        hintAccessed: false,
        activityTimeSpent: 0,
      },
      {
        pupilExperienceLessonActivity: "starter-quiz",
        questionNumber: 2,
        questionType: "short-answer",
        questionResult: "incorrect",
        hintOffered: false,
        hintAccessed: true,
        activityTimeSpent: 0,
      },
    ]);
  });

  it("falls back to an empty question type when question metadata is missing", () => {
    expect(
      mapPupilQuizResultsForAnalytics({
        section: "exit-quiz",
        questionResults: [{ grade: 0, offerHint: false }],
        questionsArray: [],
      }),
    ).toEqual([
      expect.objectContaining({
        pupilExperienceLessonActivity: "exit-quiz",
        questionType: "",
      }),
    ]);
  });
});
