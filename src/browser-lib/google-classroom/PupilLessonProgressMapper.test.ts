import {
  PostSubmissionState,
  PupilLessonProgress,
  questionResultSchema,
} from "@oaknational/google-classroom-addon/types";
import { z } from "zod";

import { PupilLessonProgressMapper } from "./PupilLessonProgressMapper";

const mockQuestionResult: z.infer<typeof questionResultSchema> = {
  mode: "feedback" as z.infer<typeof questionResultSchema>["mode"],
  grade: 1,
  pupilAnswer: null,
  feedback: "correct" as z.infer<typeof questionResultSchema>["feedback"],
  isPartiallyCorrect: false,
  correctAnswer: undefined,
  usedHint: false,
};

const mockPupilProgress: PupilLessonProgress = {
  postSubmissionState: PostSubmissionState.CREATED,
  submissionId: "sub-1",
  attachmentId: "att-1",
  courseId: "course-1",
  itemId: "item-1",
  pupilLoginHint: "hint-1",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  intro: {
    worksheetDownloaded: true,
    worksheetAvailable: true,
    isComplete: true,
  },
  video: {
    isComplete: true,
    played: true,
    duration: 120,
    timeElapsed: 90,
  },
  starterQuiz: {
    grade: 3,
    numQuestions: 5,
    isComplete: true,
    questionResults: [mockQuestionResult],
  },
  exitQuiz: {
    grade: 4,
    numQuestions: 6,
    isComplete: true,
    questionResults: [{ ...mockQuestionResult, grade: 0, usedHint: true }],
  },
};

const baseArgs = {
  pupilProgress: mockPupilProgress,
  lessonTitle: "Test Lesson",
  lessonSlug: "test-lesson",
  subject: "Maths",
  yearDescription: "Year 6",
};

describe("PupilLessonProgressMapper.toLessonAttemptData", () => {
  it("builds attemptId from submissionId, attachmentId and itemId", () => {
    const result = PupilLessonProgressMapper.toLessonAttemptData(baseArgs);
    expect(result.attemptId).toBe("sub-1:att-1:item-1");
  });

  it("maps lessonData from provided title and slug", () => {
    const result = PupilLessonProgressMapper.toLessonAttemptData(baseArgs);
    expect(result.lessonData).toEqual({
      title: "Test Lesson",
      slug: "test-lesson",
    });
  });

  it("maps browseData from provided subject and yearDescription", () => {
    const result = PupilLessonProgressMapper.toLessonAttemptData(baseArgs);
    expect(result.browseData).toEqual({
      subject: "Maths",
      yearDescription: "Year 6",
    });
  });

  it("maps createdAt from pupilProgress", () => {
    const result = PupilLessonProgressMapper.toLessonAttemptData(baseArgs);
    expect(result.createdAt).toBe("2024-01-01T00:00:00.000Z");
  });

  it("maps intro section results", () => {
    const result = PupilLessonProgressMapper.toLessonAttemptData(baseArgs);
    expect(result.sectionResults.intro).toEqual({
      worksheetDownloaded: true,
      worksheetAvailable: true,
      isComplete: true,
    });
  });

  it("maps video section results", () => {
    const result = PupilLessonProgressMapper.toLessonAttemptData(baseArgs);
    expect(result.sectionResults.video).toEqual(
      expect.objectContaining({
        isComplete: true,
        played: true,
        duration: 120,
        timeElapsed: 90,
      }),
    );
  });

  it("maps starter quiz grade and numQuestions", () => {
    const result = PupilLessonProgressMapper.toLessonAttemptData(baseArgs);
    expect(result.sectionResults["starter-quiz"]).toMatchObject({
      grade: 3,
      numQuestions: 5,
    });
  });

  it("maps exit quiz grade and numQuestions", () => {
    const result = PupilLessonProgressMapper.toLessonAttemptData(baseArgs);
    expect(result.sectionResults["exit-quiz"]).toMatchObject({
      grade: 4,
      numQuestions: 6,
    });
  });

  it("maps question results for starter quiz", () => {
    const result = PupilLessonProgressMapper.toLessonAttemptData(baseArgs);
    const qrs = result.sectionResults["starter-quiz"]?.questionResults;
    expect(qrs).toHaveLength(1);
    expect(qrs?.[0]).toMatchObject({
      grade: 1,
      mode: "feedback",
      offerHint: false,
    });
  });

  it("maps usedHint to offerHint for exit quiz question results", () => {
    const result = PupilLessonProgressMapper.toLessonAttemptData(baseArgs);
    const qrs = result.sectionResults["exit-quiz"]?.questionResults;
    expect(qrs?.[0]?.offerHint).toBe(true);
  });

  it("defaults intro fields to false when intro is undefined", () => {
    const result = PupilLessonProgressMapper.toLessonAttemptData({
      ...baseArgs,
      pupilProgress: { ...mockPupilProgress, intro: undefined },
    });
    expect(result.sectionResults.intro).toEqual({
      worksheetDownloaded: false,
      worksheetAvailable: false,
      isComplete: false,
    });
  });

  it("defaults video fields when video is undefined", () => {
    const result = PupilLessonProgressMapper.toLessonAttemptData({
      ...baseArgs,
      pupilProgress: { ...mockPupilProgress, video: undefined },
    });
    expect(result.sectionResults.video).toMatchObject({
      isComplete: false,
      played: false,
      duration: -1,
      timeElapsed: -1,
    });
  });

  it("returns empty object for starter-quiz when starterQuiz is undefined", () => {
    const result = PupilLessonProgressMapper.toLessonAttemptData({
      ...baseArgs,
      pupilProgress: { ...mockPupilProgress, starterQuiz: undefined },
    });
    expect(result.sectionResults["starter-quiz"]).toEqual({});
  });

  it("returns empty object for exit-quiz when exitQuiz is undefined", () => {
    const result = PupilLessonProgressMapper.toLessonAttemptData({
      ...baseArgs,
      pupilProgress: { ...mockPupilProgress, exitQuiz: undefined },
    });
    expect(result.sectionResults["exit-quiz"]).toEqual({});
  });

  it("returns empty questionResults array when questionResults is undefined", () => {
    const result = PupilLessonProgressMapper.toLessonAttemptData({
      ...baseArgs,
      pupilProgress: {
        ...mockPupilProgress,
        starterQuiz: { grade: 0, numQuestions: 3, isComplete: false },
      },
    });
    expect(result.sectionResults["starter-quiz"]?.questionResults).toHaveLength(
      0,
    );
  });
});
