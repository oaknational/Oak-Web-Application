import type {
  AddTeacherNote,
  // AddTeacherNote,
  GetAttempt,
  GetTeacherNote,
  // GetTeacherNote,
  LogAttempt,
  PupilClient,
  State,
} from "@/browser-lib/pupil-client/client";
import { TeacherNote } from "@/node-lib/pupil-api/types";
import keysToCamelCase from "@/utils/snakeCaseConverter";
// import keysToCamelCase from "@/utils/snakeCaseConverter";

const mockAttempt = {
  attemptId: "gCgkXUx42GY-9cAniQelm",
  createdAt: "2021-09-01T12:00:00Z",
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
      isComplete: true,
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
      isComplete: false,
      grade: 3,
      numQuestions: 3,
    },
  },
};

export const mockTeacherNote: TeacherNote = {
  note_id: "hkk2-NIFaM",
  sid_key: "sid-ARHMdf",
  note_text: "Test Note",
  note_html: "<p>Test Note</p>",
  lesson_path: "teachers/lessons/transverse-waves",
};

export const mockGetAttempt = () => {
  return Promise.resolve(mockAttempt);
};

/**
 * A mock implementation of the PupilClient interface
 *
 * This class can be used in place of OakPupilClient in tests
 */
export class MockPupilClient implements PupilClient {
  constructor(private state: State = {}) {}
  init() {}
  getState(): State {
    return this.state;
  }
  onStateChange: PupilClient["onStateChange"] = () => {
    return () => {};
  };
  logAttempt: LogAttempt = () => {
    return {
      attemptId: "testAttemptId",
      promise: Promise.resolve({
        attempt_id: "testAttemptId",
        created_at: "2021-09-01T12:00:00Z",
        lesson_data: {
          title: "Test Lesson",
          slug: "test-lesson",
        },
        browse_data: {
          subject: "Test Subject",
          year_description: "Test Year",
        },
        section_results: {
          intro: {
            worksheet_downloaded: false,
            worksheet_available: false,
            is_complete: false,
          },
          "starter-quiz": {
            is_complete: true,
            grade: 3,
            num_questions: 3,
          },
          video: {
            is_complete: false,
            played: false,
            duration: 0,
            time_elapsed: 0,
            muted: false,
            signed_opened: false,
            transcript_opened: false,
          },
          "exit-quiz": {
            is_complete: false,
            grade: 3,
            num_questions: 3,
          },
        },
      }),
    };
  };
  getAttempt: GetAttempt = mockGetAttempt;
  addTeacherNote: AddTeacherNote = () => {
    return {
      noteId: "testNoteId",
      promise: Promise.resolve(mockTeacherNote),
    };
  };

  getTeacherNote: GetTeacherNote = () => {
    return Promise.resolve({
      teacherNote: { ...keysToCamelCase(mockTeacherNote) },
      isEditable: true,
    });
  };

  getTeacherNoteIsEditable = () => {
    return true;
  };
}
