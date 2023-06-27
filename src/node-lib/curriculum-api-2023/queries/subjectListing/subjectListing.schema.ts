import { z } from "zod";

const subjectSchema = z.object({
  subjectSlug: z.string(),
  subjectTitle: z.string(),
  unitCount: z.number(),
  lessonCount: z.number(),
  programmeSlug: z.string(),
});

const subjectListingSchema = z.object({
  keyStageSlug: z.string(),
  keyStageTitle: z.string(),
  subjects: z.array(subjectSchema),
  subjectsUnavailable: z.array(subjectSchema).nullable(),
});

export type KeyStageSubjectData = z.infer<typeof subjectSchema>;
export type SubjectListingPageData = z.infer<typeof subjectListingSchema>;
export default subjectListingSchema;
