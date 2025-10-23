import { getLessonAttempt } from "@/node-lib/pupil-api/lesson-attempt/getLessonAttempt";
import { logLessonAttempt } from "@/node-lib/pupil-api/lesson-attempt/logLessonAttempt";
import { getTeacherNote } from "@/node-lib/pupil-api/teacher-notes/getTeacherNote";

export const pupilDatastore = {
  getLessonAttempt,
  logLessonAttempt,
  getTeacherNote,
};
