import { z } from "zod";

import { ConvertKeysToCamelCase } from "@/utils/snakeCaseConverter";

export const lessonBrowseDataSchema = z.array(
  z.object({
    lesson_slug: z.string(),
    lesson_title: z.string(),
    order: z.number(),
    is_legacy: z.boolean(),
    unit_slug: z.string(),
    subject_slug: z.string(),
    subject_title: z.string(),
    programme_slug: z.string(),
    unit_title: z.string(),
    year_description: z.string(),
  }),
);

export const pupiUnitDataSchema = z.object({
  unit_slug: z.string(),
  subject_slug: z.string(),
  subject_title: z.string(),
  programme_slug: z.string(),
  unit_title: z.string(),
  year_description: z.string(),
});

export type LessonListingBrowseData = ConvertKeysToCamelCase<
  z.infer<typeof lessonBrowseDataSchema>
>;

export type PupilUnitData = ConvertKeysToCamelCase<
  z.infer<typeof pupiUnitDataSchema>
>;
