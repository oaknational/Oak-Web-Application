import { z } from "zod";

const teachersSitemapProgrammeFilterUnitSchema = z.object({
  subject_slug: z.string(),
  phase_slug: z.string(),
  examboard_slug: z.string().nullable(),
  pathway_slug: z.string().nullable(),
  year: z.string(),
  keystage_slug: z.string(),
  subject_parent_slug: z.string().nullable(),
  non_curriculum: z.boolean().nullable(),
  actions: z.unknown().optional(),
  state: z.string(),
});

export const teachersSitemapDataSchema = z.object({
  units: z.array(
    z.object({
      programme_slug: z.string(),
      unit_slug: z.string(),
    }),
  ),
  lessons: z.array(
    z.object({
      programme_slug: z.string(),
      unit_slug: z.string(),
      lesson_slug: z.string(),
    }),
  ),
  programmeFilterUnits: z.array(teachersSitemapProgrammeFilterUnitSchema),
});

export type TeachersSitemapDataSchemaSnake = z.infer<
  typeof teachersSitemapDataSchema
>;

export type TeachersSitemapProgrammeFilterUnit = {
  subjectSlug: string;
  phaseSlug: string;
  examboardSlug: string | null;
  pathwaySlug: string | null;
  year: string;
  keystageSlug: string;
  subjectParentSlug: string | null;
  nonCurriculum: boolean | null;
  actions?: unknown;
  state: string;
};

export type TeachersSitemapBrowseData = {
  units: Array<{
    programmeSlug: string;
    unitSlug: string;
  }>;
  lessons: Array<{
    programmeSlug: string;
    unitSlug: string;
    lessonSlug: string;
  }>;
  programmeFilterUnits: TeachersSitemapProgrammeFilterUnit[];
};
