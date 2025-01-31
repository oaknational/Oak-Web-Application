import {
  syntheticUnitvariantLessonsSchema,
  programmeFieldsSchema,
} from "@oaknational/oak-curriculum-schema";
import { z } from "zod";

export const programmeListingResponseSchema =
  syntheticUnitvariantLessonsSchema.omit({
    supplementary_data: true,
    lesson_slug: true,
    unit_slug: true,
    unit_data: true,
    null_unitvariant_id: true,
  });

export type ProgrammeListingResponse = z.infer<
  typeof programmeListingResponseSchema
>;

const programmeSchema = z.object({
  programmeSlug: z.string(),
  subjectTitle: z.string(),
  tierSlug: programmeFieldsSchema.shape.tier_slug,
  tierTitle: programmeFieldsSchema.shape.tier_description,
  tierDisplayOrder: programmeFieldsSchema.shape.tier_display_order,
  examBoardSlug: programmeFieldsSchema.shape.examboard_slug,
  examBoardTitle: programmeFieldsSchema.shape.examboard,
  examBoardDisplayOrder: programmeFieldsSchema.shape.examboard_display_order,
  pathwaySlug: programmeFieldsSchema.shape.pathway_slug,
  pathwayTitle: programmeFieldsSchema.shape.pathway,
  pathwayDisplayOrder: programmeFieldsSchema.shape.pathway_display_order,
});

export const programmeListingSchema = z.object({
  keyStageTitle: programmeFieldsSchema.shape.keystage_description,
  keyStageSlug: programmeFieldsSchema.shape.keystage_slug,
  subjectSlug: programmeFieldsSchema.shape.subject_slug,
  subjectTitle: programmeFieldsSchema.shape.subject,
  pathwayTitle: programmeFieldsSchema.shape.pathway,
  programmes: z.array(programmeSchema),
});

export type ProgrammeListingPageData = z.infer<
  typeof programmeListingSchema
> & { legacy: boolean };
export type Programme = z.infer<typeof programmeSchema>;
