import { z } from "zod";

const lessonListingSchema = z.object({
  programmeSlug: z.string(),
  keyStageSlug: z.string(),
  keyStageTitle: z.string(),
  subjectSlug: z.string(),
  subjectTitle: z.string(),
  unitSlug: z.string(),
  unitTitle: z.string(),
  tierSlug: z.string().nullish(),
  lessons: z.array(
    z.object({
      lessonSlug: z.string(),
      lessonTitle: z.string(),
      description: z.string(),
      expired: z.boolean(),
      quizCount: z.number().nullish(),
      videoCount: z.number().nullish(),
      presentationCount: z.number().nullish(),
      worksheetCount: z.number().nullish(),
      hasCopyrightMaterial: z.boolean().nullish(),
      orderInUnit: z.number().nullish(),
    })
  ),
});

export type LessonListingSchema = z.infer<typeof lessonListingSchema>;

export default lessonListingSchema;
