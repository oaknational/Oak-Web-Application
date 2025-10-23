import { CreateLessonAttemptPayload } from "@/node-lib/pupil-api/_types/lessonAttemptTypes";
import { getPupilFirestore } from "@/node-lib/firestore/getPupilFirestore";

/**
 * Logs the lesson attempt id to the pupilLessonAttempts collection
 *
 */
export const logLessonAttempt = async (payload: CreateLessonAttemptPayload) => {
  const data = {
    ...payload,
    created_at: new Date().toISOString(),
  };
  const firestoreClient = getPupilFirestore();
  await firestoreClient.collection("pupilLessonAttempts").add(data);

  return data;
};
