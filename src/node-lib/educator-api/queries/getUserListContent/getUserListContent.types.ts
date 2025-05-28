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
        lessons: z.array(lesson_data),
        unit_title: z.string(),
        optionality_title: z.string().nullish(),
        year: z.string(),
        keystage: z.string(),
        keystage_slug: z.string(),
        subject: z.string(),
        subject_slug: z.string(),
        tier: z.string().nullable(),
        examboard: z.string().nullable(),
        unit_order: z.number(),
        year_order: z.number(),
        subject_categories: z.array(z.string()).nullish(),
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

const units = z.array(
  z.object({
    unitSlug: z.string(),
    unitTitle: z.string(),
    optionalityTitle: z.string().nullish(),
    savedAt: z.string(),
    unitOrder: z.number(),
    yearOrder: z.number(),
    year: z.string(),
    lessons: z.array(
      z.object({
        slug: z.string(),
        title: z.string(),
        state: z.string(),
        order: z.number(),
      }),
    ),
  }),
);

export type UnitData = z.infer<typeof units>;

export const userListContentApiResponse = z.record(
  z.string(),
  z.object({
    keystage: z.string(),
    keystageSlug: z.string(),
    subject: z.string(),
    subjectSlug: z.string(),
    subjectCategories: z.array(z.string()).nullish(),
    tier: z.string().nullable(),
    examboard: z.string().nullable(),
    units: units,
  }),
);

export type UserlistContentApiResponse = z.infer<
  typeof userListContentApiResponse
>;
