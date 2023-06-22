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
  subjectsUnavailable: z.null(),
});

export type SubjectSchema = z.infer<typeof subjectSchema>;
export default subjectListingSchema;
