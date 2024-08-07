import { z } from "zod";
import {
  syntheticUnitvariantLessonsSchema,
  syntheticProgrammesByYearSchema,
} from "@oaknational/oak-curriculum-schema";

import { ConvertKeysToCamelCase } from "@/utils/snakeCaseConverter";

export const lessonBrowseDataSchema = z.array(
  syntheticUnitvariantLessonsSchema.omit({
    null_unitvariant: true,
  }),
);

export const lessonBackLintDataSchema = z.array(
  syntheticProgrammesByYearSchema.pick({
    programme_slug: true,
    is_legacy: true,
  }),
);

export type LessonListingBrowseData = ConvertKeysToCamelCase<
  z.infer<typeof lessonBrowseDataSchema>
>;

export type LessonListingBackLinkData = ConvertKeysToCamelCase<
  z.infer<typeof lessonBackLintDataSchema>
>;

export type PupilLessonListingQueryData = {
  browseData: LessonListingBrowseData;
  backLinkData: LessonListingBackLinkData;
};
