import { LessonAttempt, lessonAttemptSchema } from "@/node-lib/pupil-api/types";
import { getPupilFirestore } from "@/node-lib/firestore/getPupilFirestore";
import errorReporter from "@/common-lib/error-reporter";

/**
 * Fetches the lesson attempt by the attemptId
 *
 */

export const getLessonAttempt = async (props: { attemptId: string }) => {
  const { attemptId } = props;
  const firestoreClient = getPupilFirestore();
  const snapshot = await firestoreClient
    .collection("pupilLessonAttempts")
    .where("attempt_id", "==", attemptId)
    .get();
  const attemptsById: Record<string, LessonAttempt> = {};
  const malformedAttempts: unknown[] = [];
  interface FirestoreDocument {
    data(): unknown;
  }

  snapshot.forEach((doc: FirestoreDocument) => {
    const maybeAttempt: unknown = doc.data();
    const parsed = lessonAttemptSchema.safeParse(maybeAttempt);
    if (parsed.success) {
      const attempt: LessonAttempt = parsed.data;

      const { attempt_id } = attempt;
      attemptsById[attempt_id] ??= attempt;
    } else {
      malformedAttempts.push(maybeAttempt);
    }
  });

  if (malformedAttempts.length > 0) {
    errorReporter("pupilLessonAttempts", {
      ...props,
      malformedAttempts,
    });
  }

  return { attempts: attemptsById, empty: snapshot.empty };
};
