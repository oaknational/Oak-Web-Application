import { mapPupilLessonProgressToSectionResults } from "./mapPupilLessonProgressToSectionResults";

describe("mapPupilLessonProgressToSectionResults", () => {
  it("maps all supported sections to lesson engine section keys", () => {
    const starterQuiz = {
      grade: 2,
      numQuestions: 5,
      isComplete: false,
    };
    const exitQuiz = {
      grade: 4,
      numQuestions: 5,
      isComplete: true,
    };
    const video = {
      played: true,
      duration: 300,
      timeElapsed: 120,
      isComplete: false,
    };
    const intro = {
      worksheetAvailable: true,
      worksheetDownloaded: false,
      isComplete: true,
    };

    const result = mapPupilLessonProgressToSectionResults({
      starterQuiz,
      exitQuiz,
      video,
      intro,
    } as never);

    expect(result).toEqual({
      "starter-quiz": starterQuiz,
      "exit-quiz": exitQuiz,
      video,
      intro,
    });
  });

  it("returns an empty object when progress is nullish or not an object", () => {
    expect(mapPupilLessonProgressToSectionResults(null as never)).toEqual({});
    expect(mapPupilLessonProgressToSectionResults(undefined as never)).toEqual(
      {},
    );
    expect(mapPupilLessonProgressToSectionResults("invalid" as never)).toEqual(
      {},
    );
  });

  it("ignores section values that are not objects", () => {
    const result = mapPupilLessonProgressToSectionResults({
      starterQuiz: "invalid",
      exitQuiz: 123,
      video: true,
      intro: null,
    } as never);

    expect(result).toEqual({});
  });

  it("maps only sections that are valid objects", () => {
    const result = mapPupilLessonProgressToSectionResults({
      starterQuiz: {
        grade: 1,
        numQuestions: 2,
        isComplete: false,
      },
      exitQuiz: null,
      intro: {
        worksheetAvailable: false,
        worksheetDownloaded: false,
        isComplete: false,
      },
    } as never);

    expect(result).toEqual({
      "starter-quiz": {
        grade: 1,
        numQuestions: 2,
        isComplete: false,
      },
      intro: {
        worksheetAvailable: false,
        worksheetDownloaded: false,
        isComplete: false,
      },
    });
  });
});
