import { getPupilFirestore } from "@/node-lib/firestore/getPupilFirestore";
import { TeacherNote } from "@/node-lib/pupil-api/types";

export async function upsertTeacherNote(payload: TeacherNote) {
  const { note_id, sid_key } = payload;
  const dbKey = `${sid_key}-${note_id}`;
  const data = { ...payload, updated_at: new Date().toISOString() };
  const firestoreClient = getPupilFirestore();
  await firestoreClient.collection("teacherNotes").doc(dbKey).set(data);
  return data;
}
