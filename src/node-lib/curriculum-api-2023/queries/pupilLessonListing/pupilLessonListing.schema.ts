import { z } from "zod";
import {
  syntheticUnitvariantLessonsSchema,
  syntheticProgrammesByYearSchema,
} from "@oaknational/oak-curriculum-schema";
import zodToCamelCase from "zod-to-camel-case";

export const lessonBrowseDataSchema = z.array(
  syntheticUnitvariantLessonsSchema.omit({
    null_unitvariant_id: true,
  }),
);

export const lessonBackLintDataSchema = z.array(
  syntheticProgrammesByYearSchema.pick({
    programme_slug: true,
    is_legacy: true,
  }),
);

const lessonBrowseDataSchemaCamel = zodToCamelCase(lessonBrowseDataSchema);
export type LessonListingBrowseData = z.infer<
  typeof lessonBrowseDataSchemaCamel
>;

const lessonBackLintDataCamel = zodToCamelCase(lessonBackLintDataSchema);
export type LessonListingBackLinkData = z.infer<typeof lessonBackLintDataCamel>;

export type PupilLessonListingQueryData = {
  browseData: LessonListingBrowseData;
  backLinkData: LessonListingBackLinkData;
};
