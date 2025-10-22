import { LessonAttemptFixture } from "../../fixtures/lesson-attempt.fixture";
import { TeacherNoteFixture } from "../../fixtures/teacher-note.fixture";

const teacherNoteDoc = {
  exists: true,
  data: () => ({
    ...TeacherNoteFixture(),
    created_at: "2021-09-01T00:00:00.000Z",
  }),
  ref: {}, // for batch operations
};

const lessonAttemptDoc = {
  id: "sNHeiaNYiplPq62goZXUM",
  data: () => ({
    ...LessonAttemptFixture(),
    created_at: "2021-09-01T00:00:00.000Z",
  }),
  ref: {}, // for batch operations
};

const mockFirestore = {
  _collectionName: null,
  collection: jest.fn(function (name: string) {
    this._collectionName = name;
    return this;
  }),
  where: jest.fn().mockReturnThis(),
  doc: jest.fn(function (dbKey: string) {
    this._docKey = dbKey;
    return this;
  }),
  add: jest.fn().mockResolvedValue({ id: "mockedId" }),
  set: jest.fn().mockResolvedValue(undefined),
  get: jest.fn(function () {
    // For .doc().get() on teacherNotes
    if (this._collectionName === "teacherNotes" && this._docKey) {
      if (this._docKey === "sid-9226e5-sNHeiaNYip") {
        return Promise.resolve(teacherNoteDoc);
      }
      // Simulate not found
      return Promise.resolve({ exists: false, data: () => null });
    }
    // For .collection().get() on teacherNotes (batch)
    if (this._collectionName === "teacherNotes" && !this._docKey) {
      return Promise.resolve({
        docs: [
          teacherNoteDoc,
          {
            ...teacherNoteDoc,
            data: () => ({
              ...TeacherNoteFixture({
                note_id: "aNHeiaNYip",
                sid_key: "sid-sGye6r",
              }),
              created_at: "2024-09-01T00:00:00.001Z",
            }),
          },
        ],
        length: 2,
      });
    }
    // For .collection().get() on pupilLessonAttempts
    if (this._collectionName === "pupilLessonAttempts") {
      interface LessonAttemptDoc {
        id: string;
        data: () => ReturnType<typeof LessonAttemptFixture> & {
          created_at: string;
        };
        ref: object;
      }

      interface LessonAttemptQuerySnapshot {
        forEach: (cb: (doc: LessonAttemptDoc) => void) => void;
        empty: boolean;
        docs: LessonAttemptDoc[];
        length: number;
      }

      const lessonAttemptQuerySnapshot: LessonAttemptQuerySnapshot = {
        forEach: (cb: (doc: LessonAttemptDoc) => void) => cb(lessonAttemptDoc),
        empty: false,
        docs: [lessonAttemptDoc],
        length: 1,
      };

      return Promise.resolve(lessonAttemptQuerySnapshot);
    }
    // Default: empty result
    return Promise.resolve({
      forEach: () => {},
      empty: true,
      docs: [],
      length: 0,
    });
  }),
  batch: jest.fn(() => ({
    set: jest.fn(),
    commit: jest.fn().mockResolvedValue(undefined),
  })),
};

const MockFirestore = jest.fn(() => mockFirestore);

module.exports = {
  Firestore: MockFirestore,
};
