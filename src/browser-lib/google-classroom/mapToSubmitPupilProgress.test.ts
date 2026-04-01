import { type ClassroomProgressContext } from "./classroomAssignmentContext";
import { mapToSubmitPupilProgress } from "./mapToSubmitPupilProgress";

import type { LessonSectionResults } from "@/components/PupilComponents/LessonEngineProvider";

const mockContext: ClassroomProgressContext = {
  submissionId: "submission-123",
  pupilLoginHint: "123456789",
  attachmentId: "attachment-456",
  courseId: "course-789",
  itemId: "item-012",
};

describe("mapToSubmitPupilProgress", () => {
  it("should map context and section results to progress args", () => {
    const sectionResults: LessonSectionResults = {
      "starter-quiz": {
        grade: 3,
        numQuestions: 5,
        isComplete: true,
        questionResults: [
          {
            mode: "feedback",
            grade: 1,
            offerHint: false,
            pupilAnswer: 2,
            feedback: "correct",
            correctAnswer: "Some answer",
          },
          {
            mode: "feedback",
            grade: 1,
            offerHint: true,
            pupilAnswer: ["a", "b"],
            feedback: ["correct", "incorrect"],
            isPartiallyCorrect: true,
            correctAnswer: ["a", "c"],
          },
          {
            mode: "feedback",
            grade: 1,
            offerHint: false,
            pupilAnswer: "my answer",
            feedback: "correct",
          },
          {
            mode: "init",
            grade: 0,
            offerHint: false,
          },
          {
            mode: "init",
            grade: 0,
            offerHint: false,
          },
        ],
      },
      "exit-quiz": {
        grade: 4,
        numQuestions: 6,
        isComplete: true,
      },
    };

    const result = mapToSubmitPupilProgress(mockContext, sectionResults);

    expect(result).toEqual({
      submissionId: "submission-123",
      attachmentId: "attachment-456",
      courseId: "course-789",
      itemId: "item-012",
      pupilLoginHint: "123456789",
      starterQuiz: {
        grade: 3,
        numQuestions: 5,
        isComplete: true,
        questionResults: [
          {
            mode: "feedback",
            grade: 1,
            pupilAnswer: 2,
            feedback: "correct",
            isPartiallyCorrect: undefined,
            usedHint: false,
            correctAnswer: "Some answer",
          },
          {
            mode: "feedback",
            grade: 1,
            pupilAnswer: ["a", "b"],
            feedback: ["correct", "incorrect"],
            isPartiallyCorrect: true,
            usedHint: true,
            correctAnswer: ["a", "c"],
          },
          {
            mode: "feedback",
            grade: 1,
            pupilAnswer: "my answer",
            feedback: "correct",
            isPartiallyCorrect: undefined,
            usedHint: false,
            correctAnswer: undefined,
          },
          {
            mode: "init",
            grade: 0,
            pupilAnswer: null,
            feedback: undefined,
            isPartiallyCorrect: undefined,
            usedHint: false,
            correctAnswer: undefined,
          },
          {
            mode: "init",
            grade: 0,
            pupilAnswer: null,
            feedback: undefined,
            isPartiallyCorrect: undefined,
            usedHint: false,
            correctAnswer: undefined,
          },
        ],
      },
      exitQuiz: {
        grade: 4,
        numQuestions: 6,
        isComplete: true,
        questionResults: undefined,
      },
    });
  });

  it("should include correctAnswer and map offerHint to usedHint in questionResults", () => {
    const sectionResults: LessonSectionResults = {
      "starter-quiz": {
        grade: 1,
        numQuestions: 1,
        isComplete: true,
        questionResults: [
          {
            mode: "feedback",
            grade: 1,
            offerHint: true,
            pupilAnswer: 0,
            feedback: "correct",
            correctAnswer: "The correct answer text",
            isPartiallyCorrect: false,
          },
        ],
      },
    };

    const result = mapToSubmitPupilProgress(mockContext, sectionResults);
    const qr = result.starterQuiz?.questionResults?.[0];

    expect(qr).toBeDefined();
    expect(qr).not.toHaveProperty("offerHint");
    expect(qr).toEqual({
      mode: "feedback",
      grade: 1,
      pupilAnswer: 0,
      feedback: "correct",
      isPartiallyCorrect: false,
      usedHint: true,
      correctAnswer: "The correct answer text",
    });
  });

  it("should omit questionResults when not present on quiz", () => {
    const sectionResults: LessonSectionResults = {
      "starter-quiz": {
        grade: 3,
        numQuestions: 5,
        isComplete: true,
      },
    };

    const result = mapToSubmitPupilProgress(mockContext, sectionResults);

    expect(result.starterQuiz).toEqual({
      grade: 3,
      numQuestions: 5,
      isComplete: true,
    });
    expect(result.starterQuiz?.questionResults).toBeUndefined();
  });

  it("should include video progress when present", () => {
    const sectionResults: LessonSectionResults = {
      video: {
        played: true,
        duration: 300,
        timeElapsed: 250,
        isComplete: true,
        muted: false,
        signedOpened: false,
        transcriptOpened: false,
      },
    };

    const result = mapToSubmitPupilProgress(mockContext, sectionResults);

    expect(result.video).toEqual({
      played: true,
      duration: 300,
      timeElapsed: 250,
      isComplete: true,
    });
  });

  it("should sanitize non-text correctAnswer values to keep payload valid", () => {
    const sectionResults = {
      "starter-quiz": {
        grade: 1,
        numQuestions: 1,
        isComplete: false,
        questionResults: [
          {
            mode: "feedback",
            grade: 1,
            offerHint: false,
            pupilAnswer: [0],
            feedback: ["correct"],
            correctAnswer: [
              "first",
              { type: "image", imageObject: { url: "test" } },
              undefined,
            ],
          },
        ],
      },
    } as unknown as LessonSectionResults;

    const result = mapToSubmitPupilProgress(mockContext, sectionResults);
    const qr = result.starterQuiz?.questionResults?.[0];

    expect(qr?.correctAnswer).toEqual(["first"]);
  });

  it("should default missing quiz metrics to keep submission valid", () => {
    const sectionResults = {
      "starter-quiz": {
        isComplete: true,
      },
    } as unknown as LessonSectionResults;

    const result = mapToSubmitPupilProgress(mockContext, sectionResults);

    expect(result.starterQuiz).toEqual({
      grade: 0,
      numQuestions: 0,
      isComplete: true,
      questionResults: undefined,
    });
  });

  it("should include intro progress when present", () => {
    const sectionResults: LessonSectionResults = {
      intro: {
        worksheetAvailable: true,
        worksheetDownloaded: false,
        isComplete: true,
      },
    };

    const result = mapToSubmitPupilProgress(mockContext, sectionResults);

    expect(result.intro).toEqual({
      worksheetAvailable: true,
      worksheetDownloaded: false,
      isComplete: true,
    });
  });

  it("should omit sections that are not present", () => {
    const sectionResults: LessonSectionResults = {};

    const result = mapToSubmitPupilProgress(mockContext, sectionResults);

    expect(result.starterQuiz).toBeUndefined();
    expect(result.exitQuiz).toBeUndefined();
    expect(result.video).toBeUndefined();
    expect(result.intro).toBeUndefined();
  });

  it("should throw when context fields are invalid", () => {
    const missingContext = {
      ...mockContext,
      submissionId: undefined,
    } as unknown as ClassroomProgressContext;

    expect(() => mapToSubmitPupilProgress(missingContext, {})).toThrow();
  });
});
