import { z } from "zod";

export const pathwaySchema = z.object({
  programme_slug: z.string(),
  unit_slug: z.string(),
  unit_title: z.string(),
  key_stage_slug: z.string(),
  key_stage_title: z.string(),
  subject_slug: z.string(),
  subject_title: z.string(),
  tier_slug: z.string().nullish(),
  tier_title: z.string().nullish(),
  exam_board_slug: z.string().nullish(),
  exam_board_title: z.string().nullish(),
  year_slug: z.string().nullish(),
  year_title: z.string().nullish(),
});

const searchResultsSourceCommon = z.object({
  id: z.number().nullish(),
  slug: z.string(),
  title: z.string(),
  // Shouldn't be nullish, but 2020 results are currently constructed on the client
  programme_slug: z.string().nullish(),
  subject_title: z.string(),
  subject_slug: z.string(),
  key_stage_title: z.string(),
  key_stage_slug: z.string(),
  // These are nullish, as the old search API returns unit slugs as topic_slug etc.
  year_slug: z.string().nullish(),
  year_title: z.string().nullish(),
  unit_slug: z.string().nullish(),
  unit_title: z.string().nullish(),
  expired: z.boolean().nullish(),
  theme_title: z.string().nullish(),
  tier: z.string().nullish(),
  phase: z.string().nullish(),
  pathways: z.array(pathwaySchema).default([]),
  cohort: z.string().optional(),
});

const searchResultsSourceLessonSchema = searchResultsSourceCommon.extend({
  type: z.string(),
  lesson_description: z.string().nullish(),
  pupil_lesson_outcome: z.string().nullish(),
  // topic slug/title are deprecated terms for unit slug/title
  topic_title: z.string().nullish(),
  topic_slug: z.string().nullish(),
  has_copyright_material: z.boolean().nullish(),
});

const searchResultsSourceUnitSchema = searchResultsSourceCommon.extend({
  type: z.literal("unit"),
  year_slug: z.string().nullish(),
  number_of_lessons_calculated: z.number().nullish(),
  number_of_lessons_expired: z.number().nullish(),
});

const searchResultsHighlightLessonSchema = z.object({
  lesson_description: z.coerce.string(),
  pupil_lesson_outcome: z.coerce.string(),
  topic_title: z.coerce.string(),
});

const searchResultsHighlightUnitSchema = z.object({
  topic_title: z.coerce.string(),
});

const searchHitBaseSchema = z.object({
  _id: z.string(),
  _index: z.string(),
  _score: z.number(),
  legacy: z.boolean().optional(),
});

export const lessonSearchHitSchema = z.object({
  ...searchHitBaseSchema.shape,
  _ignored: z.array(z.string()).nullish(),
  _source: searchResultsSourceLessonSchema,
  highlight: searchResultsHighlightLessonSchema.partial().nullish(),
});
export const unitSearchHitSchema = z.object({
  ...searchHitBaseSchema.shape,
  _source: searchResultsSourceUnitSchema,
  highlight: searchResultsHighlightUnitSchema.partial().nullish(),
});
export const searchResultsHitSchema = z.union([
  lessonSearchHitSchema,
  unitSearchHitSchema,
]);
export const searchResultsHitsSchema = z.array(searchResultsHitSchema);
export const searchResultsSchema = z.object({
  took: z.number(),
  hits: z.object({
    hits: z.array(searchResultsHitSchema),
  }),
});

const rawBaseSearchResultSchema = z.object({
  cohort: z.string(),
  examBoardSlug: z.string().nullish(),
  examBoardTitle: z.string().nullish(),
  isLegacy: z.boolean(),
  keyStageSlug: z.string(),
  keyStageTitle: z.string(),
  programmeSlug: z.string(),
  subjectSlug: z.string(),
  subjectTitle: z.string(),
  tierSlug: z.string().nullish(),
  tierTitle: z.string().nullish(),
  unitSlug: z.string(),
  unitTitle: z.string(),
  yearSlug: z.string().nullish(),
  yearTitle: z.string().nullish(),
});

const rawHighlightSchema = z.object({
  pupilLessonOutcome: z.array(z.string()).optional(),
  all_fields: z.array(z.string()).optional(),
});

export type RawHighlightSchema = z.infer<typeof rawHighlightSchema>;

export const rawSearchResponseSchema = z.object({
  took: z.number(),
  timed_out: z.boolean(),
  hits: z.object({
    hits: z.array(
      z.object({
        _id: z.string(),
        _index: z.string(),
        _score: z.number(),
        highlight: rawHighlightSchema.nullish(),
        _source: z.object({
          ...rawBaseSearchResultSchema.shape,
          pupilLessonOutcome: z.string().nullish(),
          description: z.string().nullish(),
          type: z.union([z.literal("lesson"), z.literal("unit")]),
          lessonSlug: z.string().nullish(),
          lessonTitle: z.string().nullish(),
          pathways: z.array(rawBaseSearchResultSchema),
          unitVariantId: z.number().nullish(),
        }),
      }),
    ),
  }),
});

export type RawSearchResponseData = z.infer<typeof rawSearchResponseSchema>;
