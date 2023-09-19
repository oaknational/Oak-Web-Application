import { z } from "zod";

import { pathwaySchema } from "../lessonOverviewCanonical/lessonOverviewCanonical.schema";

export const lessonDownloadsCanonicalSchema = z.object({
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
    }),
  ),
  lessonSlug: z.string(),
  lessonTitle: z.string(),
  pathways: z.array(pathwaySchema),
});

export type LessonDownloadsCanonical = z.infer<
  typeof lessonDownloadsCanonicalSchema
>;

export default lessonDownloadsCanonicalSchema;
