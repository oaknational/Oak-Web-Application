import { z } from "zod";

const lesson_data = z.object({
  slug: z.string(),
  title: z.string(),
  order: z.number(),
  _state: z.string(),
});

const content = z.object({
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
      pathway: z.string().nullish(),
      subject: z.string(),
      subject_slug: z.string(),
      tier: z.string().nullable(),
      examboard: z.string().nullable(),
      unit_order: z.number(),
      year_order: z.number(),
      subject_categories: z.array(z.string()).nullish(),
    }),
  ),
});

export const getUserListContentResponse = z.object({
  content_lists: z.array(
    z.object({
      content: content,
      created_at: z.string(),
    }),
  ),
});

const unit = z.object({
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
});

export type MyLibraryUnit = z.infer<typeof unit>;

export const userListContentApiResponse = z.record(
  z.string(),
  z.object({
    programmeSlug: z.string(),
    keystage: z.string(),
    keystageSlug: z.string(),
    pathway: z.string().nullish(),
    subject: z.string(),
    subjectSlug: z.string(),
    subjectCategory: z.string().nullish(),
    tier: z.string().nullable(),
    examboard: z.string().nullable(),
    units: z.array(unit),
  }),
);

export type UserlistContentApiResponse = z.infer<
  typeof userListContentApiResponse
>;
