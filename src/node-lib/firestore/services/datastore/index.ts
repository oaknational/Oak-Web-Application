import {
  LessonAttempt,
  lessonAttemptSchema,
  CreateLessonAttemptPayload,
  TeacherNote,
} from "@/app/api/types/pupil-api/types";
import { reportErr } from "@/node-lib/firestore/services/reportErr";
import { getPupilFirestore } from "@/node-lib/firestore/getPupilFirestore";

/**
 * Fetches the lesson attempt by the attemptId
 *
 */

async function getLessonAttempt(props: { attemptId: string }) {
  const { attemptId } = props;
  const firestoreClient = getPupilFirestore(); // Replace with actual Firestore client import
  const snapshot = await firestoreClient
    .collection("pupilLessonAttempts")
    .where("attempt_id", "==", attemptId)
    .get();
  const attemptsById: Record<string, LessonAttempt> = {};
  const malformedAttempts: unknown[] = [];
  snapshot.forEach((doc) => {
    const maybeAttempt = doc.data();
    const parsed = lessonAttemptSchema.safeParse(maybeAttempt);
    if (parsed.success) {
      const attempt = parsed.data;

      const { attempt_id } = attempt;
      if (!attemptsById[attempt_id]) {
        attemptsById[attempt_id] = attempt;
      }
    } else {
      malformedAttempts.push(maybeAttempt);
    }
  });

  if (malformedAttempts.length > 0) {
    await reportErr(new Error("Malformed attempts found"), {
      ...props,
      malformedAttempts,
    });
  }

  return { attempts: attemptsById, empty: snapshot.empty };
}

/**
 * Logs the lesson attempt id to the pupilLessonAttempts collection
 *
 */
export const logLessonAttempt = async (payload: CreateLessonAttemptPayload) => {
  const data = {
    ...payload,
    created_at: new Date().toISOString(),
  };
  const firestoreClient = getPupilFirestore(); // Replace with actual Firestore client import
  await firestoreClient.collection("pupilLessonAttempts").add(data);

  return data;
};

export async function getTeacherNote({
  noteId,
  sidKey,
}: {
  noteId: string;
  sidKey: string;
}): Promise<TeacherNote | null> {
  const dbKey = `${sidKey}-${noteId}`;
  const firestoreClient = getPupilFirestore(); // Replace with actual Firestore client import
  const ref = firestoreClient.collection("teacherNotes").doc(dbKey);
  const doc = await ref.get();
  if (!doc.exists) {
    return null;
  }
  return doc.data() as TeacherNote;
}

export const datastore = {
  getLessonAttempt,
  logLessonAttempt,
  getTeacherNote,
};
