import { z } from "zod";
import {
  syntheticUnitvariantLessonsSchema,
  syntheticProgrammesByYearSchema,
  SyntheticUnitvariantLessonsCamel,
} from "@oaknational/oak-curriculum-schema";

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

export type LessonListingBrowseData = Array<
  Omit<SyntheticUnitvariantLessonsCamel, "nullUnitvariantId">
>;

export type LessonListingBackLinkData = Array<{
  programmeSlug: string;
  isLegacy: boolean;
}>;

export type PupilLessonListingQueryData = {
  browseData: LessonListingBrowseData;
  backLinkData: LessonListingBackLinkData;
};
