import { getPupilFirestore } from "@/node-lib/firestore/getPupilFirestore";
import { TeacherNote } from "@/node-lib/pupil-api/_types/teacherNoteTypes";

jest.mock("@bugsnag/js");
jest.mock("@google-cloud/firestore");

export async function getTeacherNote({
  noteId,
  sidKey,
}: {
  noteId: string;
  sidKey: string;
}): Promise<TeacherNote | null> {
  const dbKey = `${sidKey}-${noteId}`;
  const firestoreClient = getPupilFirestore();
  const ref = firestoreClient.collection("teacherNotes").doc(dbKey);
  const doc = await ref.get();
  if (!doc.exists) {
    return null;
  }
  return doc.data() as TeacherNote;
}
