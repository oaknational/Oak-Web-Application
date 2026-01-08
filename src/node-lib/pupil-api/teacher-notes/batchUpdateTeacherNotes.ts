import { QueryDocumentSnapshot } from "@google-cloud/firestore";

import { getPupilFirestore } from "@/node-lib/firestore";
import { TeacherNote } from "@/node-lib/pupil-api/types";

export async function batchUpdateTeacherNotes(
  update: (doc: TeacherNote) => TeacherNote | Promise<TeacherNote>,
) {
  const firestoreClient = getPupilFirestore();
  const snapshot = await firestoreClient.collection("teacherNotes").get();

  const processBatch = async (docsInBatch: QueryDocumentSnapshot[]) => {
    const batch = firestoreClient.batch();
    for (const doc of docsInBatch) {
      const data = doc.data();
      const updatedNote = await update(data as TeacherNote);
      batch.set(doc.ref, updatedNote);
    }
    return batch.commit();
  };

  if (snapshot.docs.length > 500) {
    // 500 is batch size limit
    const chunkSize = 500;
    const chunks = Math.ceil(snapshot.docs.length / chunkSize);
    for (let i = 0; i < chunks; i++) {
      const start = i * chunkSize;
      const end = start + chunkSize;
      const chunk = snapshot.docs.slice(start, end);
      await processBatch(chunk);
    }
  } else {
    await processBatch(snapshot.docs);
  }
}
