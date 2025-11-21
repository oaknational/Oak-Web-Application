import { nanoid } from "nanoid";

import { OakPupilClient } from "./client";

import { PupilApiClient } from "@/browser-lib/pupil-client/network/PupilApiClient";
import {
  LessonAttempt,
  AttemptDataCamelCase,
  attemptDataSchema,
  TeacherNoteCamelCase,
} from "@/node-lib/pupil-api/types";
import convertKeysToSnakeCase from "@/utils/camelCaseConverter";
import { createHash } from "@/utils/createHash";
import keysToCamelCase from "@/utils/snakeCaseConverter";
import { mockTeacherNote } from "@/node-lib/pupil-api/__mocks__/MockPupilClient";

jest.mock("nanoid", () => ({
  nanoid: jest.fn(() => "testUserId"),
}));
jest.mock("@/browser-lib/pupil-client/network/PupilApiClient");

const onError = (error: unknown) => {
  throw error;
};

const testProps = { onError };

const mockAttemptData: AttemptDataCamelCase = {
  lessonData: {
    title: "Test Lesson",
    slug: "test-lesson",
  },
  browseData: {
    subject: "Test Subject",
    yearDescription: "Test Year",
  },
  sectionResults: {
    intro: {
      worksheetDownloaded: false,
      worksheetAvailable: false,
      isComplete: false,
    },
    "starter-quiz": {
      grade: 3,
      numQuestions: 3,
    },
    video: {
      isComplete: false,
      played: false,
      duration: 0,
      timeElapsed: 0,
      muted: false,
      signedOpened: false,
      transcriptOpened: false,
    },
    "exit-quiz": {
      grade: 3,
      numQuestions: 3,
    },
  },
};

const mockTeacherNoteCamel: TeacherNoteCamelCase =
  keysToCamelCase(mockTeacherNote);

const mockLessonAttempt: LessonAttempt = {
  ...attemptDataSchema.parse(convertKeysToSnakeCase(mockAttemptData)),
  attempt_id: "testUserId",
  created_at: "2021-01-01",
};

describe("OakPupilClient", () => {
  beforeEach(() => {
    jest
      .spyOn(PupilApiClient, "logAttempt")
      .mockResolvedValue(mockLessonAttempt);
    jest.spyOn(PupilApiClient, "getAttempt").mockResolvedValue({
      ARHMdfK44YeMawb1QtnxN: mockLessonAttempt,
    });

    jest
      .spyOn(PupilApiClient, "addTeacherNote")
      .mockResolvedValue(mockTeacherNote);

    jest
      .spyOn(PupilApiClient, "getTeacherNote")
      .mockResolvedValue(mockTeacherNote);

    jest.clearAllMocks();
  });

  describe("Initialization", () => {
    it("should set initial properties from the constructor", () => {
      const client = new OakPupilClient(testProps);
      expect(client["onError"]).toBe(onError);
      expect(client["state"]).toEqual({ error: undefined });
    });
  });

  describe("Managing Attempts", () => {
    describe("logAttempt", () => {
      it("should log attempts and update state accordingly", () => {
        const client = new OakPupilClient(testProps);
        client.init();
        client.logAttempt(mockAttemptData, false);
        const state = client.getState();
        const attemptPayload = convertKeysToSnakeCase(mockAttemptData);
        const parsedAttemptData = attemptDataSchema.parse(attemptPayload);
        expect(PupilApiClient.logAttempt).toHaveBeenCalledWith({
          attempt_id: "testUserId",
          ...parsedAttemptData,
        });
        expect(state.previousLoggedAttemptId).toBe("testUserId");
        expect(state.previousLoggedAttemptHash).toBe(
          "01aa1af6f32f12f9e5ddc733a57371543386bf88ac6fffde4beff854735a598a",
        );
      });
      it("should not log attempts if the attempt has already been logged", () => {
        const client = new OakPupilClient(testProps);
        client.init();
        client.logAttempt(mockAttemptData, false);
        client.logAttempt(mockAttemptData, false);
        const state = client.getState();
        expect(PupilApiClient.logAttempt).toHaveBeenCalledTimes(1);
        expect(state.previousLoggedAttemptId).toBe("testUserId");
        expect(state.previousLoggedAttemptHash).toBe(
          "01aa1af6f32f12f9e5ddc733a57371543386bf88ac6fffde4beff854735a598a",
        );
      });
      it("should not call the network if isLocal is true", () => {
        const client = new OakPupilClient(testProps);
        client.init();
        client.logAttempt(mockAttemptData, true);
        expect(PupilApiClient.logAttempt).not.toHaveBeenCalled();
      });
    });

    it("should not log attempts if the attempt has already been logged", () => {
      const client = new OakPupilClient(testProps);
      client.init();
      client.logAttempt(mockAttemptData, false);
      client.logAttempt(mockAttemptData, false);
      const state = client.getState();
      expect(PupilApiClient.logAttempt).toHaveBeenCalledTimes(1);
      expect(state.previousLoggedAttemptId).toBe("testUserId");
      expect(state.previousLoggedAttemptHash).toBe(
        createHash(JSON.stringify(mockAttemptData)),
      );
    });

    it("should not call the network if isLocal is true", async () => {
      const client = new OakPupilClient(testProps);
      client.init();
      await client.logAttempt(mockAttemptData, true);
      client.getState();
      expect(PupilApiClient.logAttempt).not.toHaveBeenCalled();
    });
    describe("getAttempt", () => {
      it("should return attempt Id if there exists an attempt hash matching the attempt id", async () => {
        jest.spyOn(Storage.prototype, "getItem").mockImplementationOnce(() => {
          return JSON.stringify(mockAttemptData);
        });
        const client = new OakPupilClient(testProps);
        client.init();
        await client.getAttempt("mockId", false);
        expect(PupilApiClient.getAttempt).not.toHaveBeenCalled();
      });
      it("should call the network if there if the attempt Id isnt in local storage", async () => {
        jest.spyOn(Storage.prototype, "getItem").mockImplementationOnce(() => {
          return null;
        });
        const client = new OakPupilClient(testProps);
        client.init();
        await client.getAttempt("mockId", false);
        expect(PupilApiClient.getAttempt).toHaveBeenCalledWith("mockId");
      });
      it("should return the attempt data from the network", async () => {
        jest.spyOn(Storage.prototype, "getItem").mockImplementationOnce(() => {
          return null;
        });
        const client = new OakPupilClient(testProps);
        client.init();
        const result = await client.getAttempt("ARHMdfK44YeMawb1QtnxN", false);
        expect(result).toEqual(keysToCamelCase(mockLessonAttempt));
      });
    });
  });

  describe("Managing Teacher Notes", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should call the API to add a teacher note", async () => {
      (nanoid as jest.Mock).mockReturnValue(mockTeacherNote.note_id);
      const client = new OakPupilClient(testProps);
      client.init();
      await client.addTeacherNote({
        teacherNote: mockTeacherNoteCamel,
      });
      expect(PupilApiClient.addTeacherNote).toHaveBeenCalledWith(
        mockTeacherNote,
      );
    });

    it("should store the teacher note id in local storage against the sid key", async () => {
      (nanoid as jest.Mock).mockReturnValue(mockTeacherNote.note_id);
      const client = new OakPupilClient(testProps);
      client.init();
      await client.addTeacherNote({
        teacherNote: mockTeacherNoteCamel,
      });
      const storedNote = localStorage.getItem(
        `oak-pupil-teacher-note:${mockTeacherNote.sid_key}`,
      );
      expect(storedNote).toBe(mockTeacherNote.note_id);
    });

    it("should throw an error if the teacher note is invalid", async () => {
      const client = new OakPupilClient(testProps);
      client.init();
      try {
        await client.addTeacherNote({
          teacherNote: {
            ...mockTeacherNoteCamel,
            sidKey: "not a sid key because it's too long",
          },
        });
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("should get a teacher note by noteId and sidKey", async () => {
      const client = new OakPupilClient(testProps);
      client.init();
      await client.getTeacherNote({
        sidKey: mockTeacherNote.sid_key,
        noteId: mockTeacherNote.note_id,
      });

      expect(PupilApiClient.getTeacherNote).toHaveBeenCalled();
      expect(PupilApiClient.getTeacherNote).toHaveBeenCalledWith({
        note_id: mockTeacherNote.note_id,
        sid_key: mockTeacherNote.sid_key,
      });
    });

    it("should return isEditable as false if the note url is not in local storage", async () => {
      // mock local storage to return null
      jest.spyOn(Storage.prototype, "getItem").mockReturnValue(null);
      const client = new OakPupilClient(testProps);
      client.init();
      const res = await client.getTeacherNote({
        sidKey: mockTeacherNote.sid_key,
        noteId: mockTeacherNote.note_id,
      });
      expect(res.isEditable).toBe(false);
    });

    it("should return isEditable as true if the note url is in local storage", async () => {
      // mock local storage to return the lesson url
      jest
        .spyOn(Storage.prototype, "getItem")
        .mockReturnValueOnce(mockTeacherNote.note_id);
      const client = new OakPupilClient(testProps);
      client.init();
      const res = await client.getTeacherNote({
        sidKey: mockTeacherNote.sid_key,
        noteId: mockTeacherNote.note_id,
      });
      expect(res.isEditable).toBe(true);
    });

    it("Should throw an error if the teacher note is invalid", async () => {
      const client = new OakPupilClient(testProps);
      client.init();
      expect(() =>
        client.getTeacherNote({
          sidKey: mockTeacherNote.sid_key,
          noteId: "not a note id",
        }),
      ).toThrowError("String must contain exactly 10 character(s)");
    });

    it("should throw an error if the noteId is not provided and not in local storage", async () => {
      const client = new OakPupilClient(testProps);
      client.init();

      expect(() =>
        client.getTeacherNote({
          sidKey: mockTeacherNote.sid_key,
        }),
      ).toThrowError("NoteId could not be found");
    });

    it("should return the teacher note using the id from local storage if noteId is not provided", async () => {
      jest
        .spyOn(Storage.prototype, "getItem")
        .mockReturnValue(mockTeacherNote.note_id);
      const client = new OakPupilClient(testProps);
      client.init();
      const res = await client.getTeacherNote({
        sidKey: mockTeacherNote.sid_key,
      });
      expect(res.teacherNote).toEqual(mockTeacherNoteCamel);
    });
  });
});
