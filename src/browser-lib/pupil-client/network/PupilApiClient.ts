import errorReporter from "@/common-lib/error-reporter";
import {
  CreateLessonAttemptPayload,
  LessonAttempt,
  TeacherNote,
  AttemptId,
} from "@/node-lib/pupil-api/types";

async function logAttempt(
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

async function getAttempt(
  attempt_id: AttemptId,
): Promise<Record<string, LessonAttempt>> {
  const response = await fetch(
    "/api/pupil/lesson-attempt?attempt_id=" + attempt_id,
  );

  if (!response.ok) {
    console.warn(
      `Failed to fetch lesson attempt: ${response.status} ${response.statusText}`,
    );
  }
  return response.json();
}

async function addTeacherNote(teacherNote: TeacherNote): Promise<TeacherNote> {
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

async function getTeacherNote({
  note_id,
  sid_key,
}: {
  note_id: string;
  sid_key: string;
}): Promise<TeacherNote> {
  const response = await fetch(
    "/api/teacher/note" + "?note_id=" + note_id + "&sid_key=" + sid_key,
  );

  if (!response.ok) {
    throw errorReporter("Failed to fetch teacher note")(
      new Error(response.statusText),
      {
        severity: "warning",
      },
    );
  }
  return response.json();
}

export const PupilApiClient = {
  logAttempt,
  getAttempt,
  addTeacherNote,
  getTeacherNote,
};
