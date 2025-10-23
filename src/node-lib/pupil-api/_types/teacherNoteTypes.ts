import { z } from "zod";

export const teacherNoteSchema = z.object({
  note_id: z.string().length(10),
  sid_key: z.string().length(10),
  note_text: z.string(),
  note_html: z.string(),
  lesson_path: z.string(),
  updated_at: z.string().optional(),
  checkedForPii: z.boolean().optional(),
});

export type TeacherNote = z.infer<typeof teacherNoteSchema>;

export const piiMatchSchema = z.object({
  infoType: z.enum([
    "PERSON_NAME",
    "EMAIL_ADDRESS",
    "PHONE_NUMBER",
    "STREET_ADDRESS",
  ]),
  string: z.string(),
  startIndex: z.number(),
  endIndex: z.number(),
});

export type PiiMatch = z.infer<typeof piiMatchSchema>;

export const teacherNoteErrorSchema = z.object({
  type: z.enum(["PII_ERROR"]),
  pii: z
    .object({
      fullRedactedString: z.string(),
      piiMatches: z.array(piiMatchSchema),
    })
    .optional(),
});

export type TeacherNoteError = z.infer<typeof teacherNoteErrorSchema>;
