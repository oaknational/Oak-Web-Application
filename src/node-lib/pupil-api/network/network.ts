import errorReporter from "@/common-lib/error-reporter";
import {
  CreateLessonAttemptPayload,
  LessonAttempt,
  TeacherNote,
  AttemptId,
} from "@/node-lib/pupil-api/types";

/**
 * Fetches and logs pupil lesson attempts to oak-pupil-api
 */
export class PupilNetworkClient {
  /**
   * Logs a pupil lesson attempt to oak-pupil-api, returning the logged attemptId, if the attempt has already been logged it will return the existing attemptId
   */
  async logAttempt(
    attempt: CreateLessonAttemptPayload,
  ): Promise<LessonAttempt> {
    const response = await fetch("/api/pupil/lesson-attempt", {
      method: "POST",
      body: JSON.stringify(attempt),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      errorReporter("Failed to log lesson attempt")(
        new Error(response.statusText),
        {
          severity: "warning",
        },
      );
    }
    return response.json();
  }

  async getAttempt(
    attempt_id: AttemptId,
  ): Promise<Record<string, LessonAttempt>> {
    const response = await fetch(
      "/api/pupil/lesson-attempt?attempt_id=" + attempt_id,
    );

    if (!response.ok) {
      errorReporter("Failed to fetch attempt")(new Error(response.statusText), {
        severity: "warning",
      });
    }
    return response.json();
  }

  async addTeacherNote(teacherNote: TeacherNote): Promise<TeacherNote> {
    const response = await fetch("/api/teacher/note", {
      method: "POST",
      body: JSON.stringify(teacherNote),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      errorReporter("Failed to log teacher note")(
        new Error(response.statusText),
        {
          severity: "warning",
        },
      );
    }
    return response.json();
  }

  async getTeacherNote({
    note_id,
    sid_key,
  }: {
    note_id: string;
    sid_key: string;
  }): Promise<TeacherNote> {
    const urlObject = new URL(
      "/api/teacher/note",
      getBrowserConfig("clientAppBaseUrl"),
    );
    urlObject.searchParams.set("note_id", note_id);
    urlObject.searchParams.set("sid_key", sid_key);
    const url = urlObject.toString();
    const response = await fetch(url);

    if (!response.ok) {
      errorReporter("Failed to fetch teacher note")(
        new Error(response.statusText),
        {
          severity: "warning",
        },
      );
    }
    return response.json();
  }
}
