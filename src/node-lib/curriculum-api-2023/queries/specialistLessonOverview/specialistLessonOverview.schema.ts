import { z } from "zod";

import {
  LessonOverviewPageData,
  lessonOverviewDownloads,
} from "../lessonOverview/lessonOverview.schema";
import {
  baseLessonOverviewSchema,
  legacyAssetObjectSchema,
  lessonOverviewQuizData,
  lessonPathwaySchema,
} from "../../shared.schema";

export type SpecialistLessonOverviewData = Omit<
  LessonOverviewPageData,
  | "keyStageSlug"
  | "keyStageTitle"
  | "tierTitle"
  | "tierSlug"
  | "yearTitle"
  | "examBoardTitle"
  | "lessonMediaClips"
  | "subjectParent"
> & {
  isCanonical: false;
  developmentStageTitle: string;
  developmentStageSlug: string | null;
  phaseTitle: string | null;
  phaseSlug: string | null;
  threads?: Threads[] | null;
  updatedAt: string;
  lessonMediaClips: null;
};

const content_guidance_schema = z.object({
  contentGuidanceLabel: z.string(),
  contentGuidanceDescription: z.string(),
  contentGuidanceArea: z.string(),
});

const misconceptions_and_commom_mistakes_schema = z.object({
  misconception: z.string(),
  response: z.string(),
});

const teacher_tips_schema = z.object({
  teacher_tip: z.string(),
});

const lesson_equipment_and_resources_schema = z.object({
  equipment: z.string(),
});

const key_learning_points_schema = z.object({
  key_learning_point: z.string().nullable(),
});

const threads = z.object({
  threadSlug: z.string().optional(),
  threadTitle: z.string().optional(),
});

type Threads = z.infer<typeof threads>;

const combined_programme_fields = z.object({
  subject: z.string(),
  subject_slug: z.string(),
  developmentstage: z.string().nullish(),
  developmentstage_slug: z.string().nullish(),
  phase_description: z.string().nullable().optional(),
  phase_slug: z.string().nullable().optional(),
});

export const specialistLessonOverviewRawSchema = z.array(
  z.object({
    lesson_slug: z.string(),
    lesson_title: z.string(),
    synthetic_programme_slug: z.string(),
    unit_slug: z.string(),
    unit_title: z.string(),
    combined_programme_fields: combined_programme_fields,
    pupil_lesson_outcome: z.string(),
    key_learning_points: z.array(key_learning_points_schema).nullable(),
    contains_copyright_content: z.boolean(),
    expired: z.boolean().nullable(),
    misconceptions_and_common_mistakes: z
      .array(misconceptions_and_commom_mistakes_schema)
      .nullable(),
    equipment_and_resources: z
      .array(lesson_equipment_and_resources_schema)
      .nullable()
      .optional(),
    teacher_tips: z.array(teacher_tips_schema).nullable(),
    content_guidance: z.array(content_guidance_schema).nullable(),
    supervision_level: z.string().nullable(),
    threads: z.array(threads).nullable(),
    video_mux_playback_id: z.string().nullable(),
    video_with_sign_language_mux_playback_id: z.string().nullable(),
    video_title: z.string().nullable(),
    worksheet_url: z.string().nullable(),
    presentation_url: z.string().nullable(),
    starter_quiz: lessonOverviewQuizData,
    exit_quiz: lessonOverviewQuizData,
    transcript_sentences: z.union([z.array(z.string()), z.string()]).nullable(),
    starter_quiz_asset_object: legacyAssetObjectSchema,
    exit_quiz_asset_object: legacyAssetObjectSchema,
    worksheet_asset_object: legacyAssetObjectSchema,
    lesson_release_date: z.string().nullable(),
  }),
);

export type SpecialistLessonDataRaw = z.infer<
  typeof specialistLessonOverviewRawSchema
>;

const specialistLessonOverviewSchema = baseLessonOverviewSchema.extend({
  programmeSlug: z.string(),
  unitSlug: z.string(),
  unitTitle: z.string(),
  subjectSlug: z.string(),
  subjectTitle: z.string(),
  phaseSlug: z.string().nullable(),
  phaseTitle: z.string().nullable(),
  developmentStageSlug: z.string().nullable(),
  developmentStageTitle: z.string(),
  isSpecialist: z.literal(true),
  isCanonical: z.literal(false),
  downloads: lessonOverviewDownloads,
  updatedAt: z.string(),
  pathways: z.array(lessonPathwaySchema),
});

export type SpecialistLessonOverview = z.infer<
  typeof specialistLessonOverviewSchema
>;

export default specialistLessonOverviewSchema;
