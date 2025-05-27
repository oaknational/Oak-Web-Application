import { z } from "zod";

const lesson_data = z.object({
  slug: z.string(),
  title: z.string(),
  order: z.number(),
  _state: z.string(),
});

const users_content_lists = z.object({
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
        tier: z.string().nullable(),
        examboard: z.string().nullable(),
      }),
    ),
  }),
});

const users_content = z.array(
  z.object({
    users_content_lists: users_content_lists.nullable(),
  }),
);

export type UsersContent = z.infer<typeof users_content>;

export const getUserListContentResponse = z.object({
  users_content: users_content,
});
