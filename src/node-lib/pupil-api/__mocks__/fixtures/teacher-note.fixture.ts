import { TeacherNote } from "@/node-lib/pupil-api/types";

export const TeacherNoteFixture = (
  partial?: Partial<TeacherNote>,
): TeacherNote => {
  return {
    sid_key: "sid-9226e5",
    note_id: "sNHeiaNYip",
    note_text: "learning stuff",
    note_html: "<h1>learning stuff</h1>",
    lesson_path: "teachers/lessons/lesson-slug",
    ...partial,
  };
};
