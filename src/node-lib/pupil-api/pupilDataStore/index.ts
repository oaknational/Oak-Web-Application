import { getLessonAttempt } from "@/node-lib/pupil-api/functions/getLessonAttempt";
import { logLessonAttempt } from "@/node-lib/pupil-api/functions/logLessonAttempt";
import { getTeacherNote } from "@/node-lib/pupil-api/functions/getTeacherNote";

export const pupilDatastore = {
  getLessonAttempt,
  logLessonAttempt,
  getTeacherNote,
};
