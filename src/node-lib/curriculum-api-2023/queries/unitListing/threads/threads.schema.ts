import { z } from "zod";

export const threadsResponseSchema = z.array(
  z.object({
    threads: z.array(
      z.object({
        threads: z
          .array(z.object({ theme_slug: z.string(), theme_title: z.string() }))
          .nullish(),
        unit_id: z.number(),
      }),
    ),
  }),
);

export const learningThemesSchema = z.object({
  themeTitle: z.string(),
  themeSlug: z.string(),
});

export const learningThemes = z.array(learningThemesSchema);

export type LearningThemes = z.infer<typeof learningThemes>;
