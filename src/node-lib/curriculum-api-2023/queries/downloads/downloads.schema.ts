import { z } from "zod";

export const lessonDownloadsSchema = z.object({
  downloads: z.array(
    z.object({
      exists: z.boolean().nullable(),
      type: z.enum([
        "presentation",
        "intro-quiz-questions",
        "intro-quiz-answers",
        "exit-quiz-questions",
        "exit-quiz-answers",
        "worksheet-pdf",
        "worksheet-pptx",
        "supplementary-pdf",
        "supplementary-pptx",
      ]),
      label: z.string(),
      ext: z.string(),
      forbidden: z.union([
        z.array(z.object({ copyright_info: z.string() })),
        z.boolean().optional().nullish(),
      ]),
    })
  ),
  programmeSlug: z.string(),
  keyStageSlug: z.string(),
  keyStageTitle: z.string(),
  lessonSlug: z.string(),
  lessonTitle: z.string(),
  subjectSlug: z.string(),
  subjectTitle: z.string(),
  unitSlug: z.string(),
  unitTitle: z.string(),
});

export type LessonDownloadsPageData = z.infer<typeof lessonDownloadsSchema>;

export default lessonDownloadsSchema;
