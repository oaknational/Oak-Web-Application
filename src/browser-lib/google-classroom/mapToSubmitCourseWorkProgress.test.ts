import {
  mapToSubmitCourseWorkProgress,
  type CourseWorkProgressContext,
} from "./mapToSubmitCourseWorkProgress";

import type { LessonSectionResults } from "@/components/PupilComponents/LessonEngineProvider";

const baseContext: CourseWorkProgressContext = {
  submissionId: "submission-123",
  assignmentToken: "token-abc",
  courseWorkId: "coursework-456",
  courseId: "course-789",
  pupilLoginHint: "pupil@example.com",
};

describe("mapToSubmitCourseWorkProgress", () => {
  it("maps context fields directly onto the payload", () => {
    const result = mapToSubmitCourseWorkProgress(baseContext, {});

    expect(result.submissionId).toBe("submission-123");
    expect(result.assignmentToken).toBe("token-abc");
    expect(result.courseWorkId).toBe("coursework-456");
    expect(result.courseId).toBe("course-789");
    expect(result.pupilLoginHint).toBe("pupil@example.com");
  });

  it("omits optional sections when sectionResults is empty", () => {
    const result = mapToSubmitCourseWorkProgress(baseContext, {});

    expect(result.starterQuiz).toBeUndefined();
    expect(result.exitQuiz).toBeUndefined();
    expect(result.video).toBeUndefined();
    expect(result.intro).toBeUndefined();
  });

  describe("starterQuiz", () => {
    it("omits starterQuiz when numQuestions is undefined", () => {
      const sectionResults: LessonSectionResults = {
        "starter-quiz": {
          grade: 0,
          numQuestions: undefined,
          isComplete: false,
        },
      };

      const result = mapToSubmitCourseWorkProgress(baseContext, sectionResults);

      expect(result.starterQuiz).toBeUndefined();
    });

    it("omits starterQuiz when numQuestions is 0", () => {
      const sectionResults: LessonSectionResults = {
        "starter-quiz": { grade: 0, numQuestions: 0, isComplete: false },
      };

      const result = mapToSubmitCourseWorkProgress(baseContext, sectionResults);

      expect(result.starterQuiz).toBeUndefined();
    });

    it("maps a complete starter quiz result", () => {
      const sectionResults: LessonSectionResults = {
        "starter-quiz": {
          grade: 4,
          numQuestions: 5,
          isComplete: true,
          questionResults: undefined,
        },
      };

      const result = mapToSubmitCourseWorkProgress(baseContext, sectionResults);

      expect(result.starterQuiz).toEqual({
        grade: 4,
        numQuestions: 5,
        isComplete: true,
        questionResults: undefined,
      });
    });

    it("maps a starter quiz result with no questionResults", () => {
      const sectionResults: LessonSectionResults = {
        "starter-quiz": { grade: 0, numQuestions: 5, isComplete: false },
      };

      const result = mapToSubmitCourseWorkProgress(baseContext, sectionResults);

      expect(result.starterQuiz).toMatchObject({
        grade: 0,
        numQuestions: 5,
        isComplete: false,
        questionResults: undefined,
      });
    });
  });

  describe("exitQuiz", () => {
    it("omits exitQuiz when numQuestions is undefined", () => {
      const sectionResults: LessonSectionResults = {
        "exit-quiz": { grade: 0, numQuestions: undefined, isComplete: false },
      };

      const result = mapToSubmitCourseWorkProgress(baseContext, sectionResults);

      expect(result.exitQuiz).toBeUndefined();
    });

    it("omits exitQuiz when numQuestions is 0", () => {
      const sectionResults: LessonSectionResults = {
        "exit-quiz": { grade: 0, numQuestions: 0, isComplete: false },
      };

      const result = mapToSubmitCourseWorkProgress(baseContext, sectionResults);

      expect(result.exitQuiz).toBeUndefined();
    });

    it("maps a complete exit quiz result", () => {
      const sectionResults: LessonSectionResults = {
        "exit-quiz": {
          grade: 8,
          numQuestions: 10,
          isComplete: true,
          questionResults: undefined,
        },
      };

      const result = mapToSubmitCourseWorkProgress(baseContext, sectionResults);

      expect(result.exitQuiz).toEqual({
        grade: 8,
        numQuestions: 10,
        isComplete: true,
        questionResults: undefined,
      });
    });
  });

  describe("questionResults mapping", () => {
    it("maps question results with a string correctAnswer", () => {
      const sectionResults: LessonSectionResults = {
        "exit-quiz": {
          grade: 1,
          numQuestions: 1,
          isComplete: true,
          questionResults: [
            {
              mode: "feedback",
              grade: 1,
              pupilAnswer: "Paris",
              feedback: "correct",
              isPartiallyCorrect: false,
              offerHint: false,
              correctAnswer: "Paris",
            },
          ],
        },
      };

      const result = mapToSubmitCourseWorkProgress(baseContext, sectionResults);

      expect(result.exitQuiz?.questionResults?.[0]).toMatchObject({
        mode: "feedback",
        grade: 1,
        pupilAnswer: "Paris",
        feedback: "correct",
        isPartiallyCorrect: false,
        usedHint: false,
        correctAnswer: "Paris",
      });
    });

    it("maps question results with an array correctAnswer, filtering out non-strings", () => {
      const sectionResults: LessonSectionResults = {
        "exit-quiz": {
          grade: 1,
          numQuestions: 1,
          isComplete: true,
          questionResults: [
            {
              mode: "feedback",
              grade: 1,
              pupilAnswer: null,
              feedback: "correct",
              isPartiallyCorrect: false,
              offerHint: true,
              correctAnswer: ["cat", undefined, "dog"] as string[],
            },
          ],
        },
      };

      const result = mapToSubmitCourseWorkProgress(baseContext, sectionResults);

      expect(result.exitQuiz?.questionResults?.[0]?.correctAnswer).toEqual([
        "cat",
        "dog",
      ]);
      expect(result.exitQuiz?.questionResults?.[0]?.usedHint).toBe(true);
    });

    it("sets correctAnswer to undefined when it is not a string or array", () => {
      const sectionResults: LessonSectionResults = {
        "exit-quiz": {
          grade: 1,
          numQuestions: 1,
          isComplete: true,
          questionResults: [
            {
              mode: "feedback",
              grade: 1,
              pupilAnswer: null,
              feedback: undefined,
              isPartiallyCorrect: undefined,
              offerHint: false,
              correctAnswer: undefined,
            },
          ],
        },
      };

      const result = mapToSubmitCourseWorkProgress(baseContext, sectionResults);

      expect(
        result.exitQuiz?.questionResults?.[0]?.correctAnswer,
      ).toBeUndefined();
    });

    it("sets pupilAnswer to null when absent", () => {
      const sectionResults: LessonSectionResults = {
        "exit-quiz": {
          grade: 1,
          numQuestions: 1,
          isComplete: true,
          questionResults: [
            {
              mode: "input",
              grade: 0,
              pupilAnswer: undefined,
              feedback: undefined,
              isPartiallyCorrect: false,
              offerHint: false,
              correctAnswer: "answer",
            },
          ],
        },
      };

      const result = mapToSubmitCourseWorkProgress(baseContext, sectionResults);

      expect(result.exitQuiz?.questionResults?.[0]?.pupilAnswer).toBeNull();
    });
  });

  describe("video", () => {
    it("maps a video section result", () => {
      const sectionResults: LessonSectionResults = {
        video: {
          played: true,
          duration: 300,
          timeElapsed: 240,
          muted: false,
          signedOpened: false,
          transcriptOpened: false,
          isComplete: false,
        },
      };

      const result = mapToSubmitCourseWorkProgress(baseContext, sectionResults);

      expect(result.video).toEqual({
        played: true,
        duration: 300,
        timeElapsed: 240,
        isComplete: false,
      });
    });
  });

  describe("intro", () => {
    it("maps an intro section result", () => {
      const sectionResults: LessonSectionResults = {
        intro: {
          worksheetAvailable: true,
          worksheetDownloaded: true,
          isComplete: true,
        },
      };

      const result = mapToSubmitCourseWorkProgress(baseContext, sectionResults);

      expect(result.intro).toEqual({
        worksheetAvailable: true,
        worksheetDownloaded: true,
        isComplete: true,
      });
    });

    it("maps an intro result with optional fields absent", () => {
      const sectionResults: LessonSectionResults = {
        intro: { isComplete: false },
      };

      const result = mapToSubmitCourseWorkProgress(baseContext, sectionResults);

      expect(result.intro).toMatchObject({ isComplete: false });
    });
  });

  it("maps all sections together", () => {
    const sectionResults: LessonSectionResults = {
      "starter-quiz": { grade: 3, numQuestions: 5, isComplete: true },
      "exit-quiz": { grade: 7, numQuestions: 10, isComplete: true },
      video: {
        played: true,
        duration: 120,
        timeElapsed: 120,
        muted: false,
        signedOpened: false,
        transcriptOpened: false,
        isComplete: true,
      },
      intro: {
        worksheetAvailable: true,
        worksheetDownloaded: false,
        isComplete: true,
      },
    };

    const result = mapToSubmitCourseWorkProgress(baseContext, sectionResults);

    expect(result.starterQuiz).toBeDefined();
    expect(result.exitQuiz).toBeDefined();
    expect(result.video).toBeDefined();
    expect(result.intro).toBeDefined();
  });

  it("throws when the schema validation fails", () => {
    const invalidContext = {
      ...baseContext,
      submissionId: 123 as unknown as string,
    };

    expect(() =>
      mapToSubmitCourseWorkProgress(
        invalidContext as CourseWorkProgressContext,
        {},
      ),
    ).toThrow();
  });
});
