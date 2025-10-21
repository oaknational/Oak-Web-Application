import { LessonAttemptFixture } from "./__mocks__/fixtures/lesson-attempt.fixture";
import { TeacherNoteFixture } from "./__mocks__/fixtures/teacher-note.fixture";

import { datastore } from ".";

jest.mock("@bugsnag/js");
jest.mock("@google-cloud/firestore");

describe("public fuctions", () => {
  describe("logLessonAttempt", () => {
    it("should add a lesson attempt log to the collection pupilLessonAttempts", async () => {
      const now = new Date();
      jest.useFakeTimers({ now });
      const result = await datastore.logLessonAttempt(LessonAttemptFixture());
      const data = {
        ...LessonAttemptFixture(),
        attempt_id: expect.any(String),
        created_at: now.toISOString(),
      };
      expect(result).toEqual(data);

      jest.useRealTimers();
    });
  });
  describe("getLessonAttempt", () => {
    it("should fetch the lesson attempt by the attemptId", async () => {
      const { attempts } = await datastore.getLessonAttempt({
        attemptId: "sNHeiaNYiplPq62goZXUM",
      });
      expect(attempts).toEqual({
        sNHeiaNYiplPq62goZXUM: {
          ...LessonAttemptFixture(),
          attempt_id: "sNHeiaNYiplPq62goZXUM",
          created_at: "2021-09-01T00:00:00.000Z",
        },
      });
    });
  });
  describe("getTeacherNote", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should fetch the correct teacher note", async () => {
      const expected = {
        ...TeacherNoteFixture(),
        created_at: "2021-09-01T00:00:00.000Z",
      };
      const notes = await datastore.getTeacherNote({
        noteId: "sNHeiaNYip",
        sidKey: "sid-9226e5",
      });

      expect(notes).toEqual(expected);
    });

    it("should return an empty array if the note is not found", async () => {
      const notes = await datastore.getTeacherNote({
        noteId: "not-found",
        sidKey: "sid-9226e5",
      });
      expect(notes).toEqual(null);
    });
  });
});
