import { z } from "zod";

const lesson_data = z.object({
  slug: z.string(),
  title: z.string(),
  order: z.number(),
  _state: z.string(),
});

export const getProgrammeUnitsResponse = z.object({
  users_content: z.array(
    z.object({
      users_content_lists: z.object({
        created_at: z.string(),
        content: z.object({
          unit_slug: z.string(),
          programme_slug: z.string(),
          browse_mv: z.array(
            z.object({
              supplementary_data: z.array(lesson_data),
              unit_title: z.string(),
              year: z.string(),
              keystage: z.string(),
              subject: z.string(),
            }),
          ),
        }),
      }),
    }),
  ),
});
