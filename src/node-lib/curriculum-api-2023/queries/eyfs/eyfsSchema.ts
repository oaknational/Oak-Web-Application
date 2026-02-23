import {
  lessonDataSchema,
  programmeFieldsSchema,
  unitDataSchema,
} from "@oaknational/oak-curriculum-schema";
import z from "zod";

export const queryResponse = z.object({
  lessons: z.array(
    z.object({
      lesson_data: lessonDataSchema.extend({
        key_learning_points: z
          .array(z.object({ key_learning_point: z.string() }))
          .nullish(),
      }),
      lesson_slug: z.string(),
      programme_fields: programmeFieldsSchema,
      unit_slug: z.string(),
      unit_data: unitDataSchema,
      programme_slug: z.string(),
      features: z.object({ expired: z.boolean().nullish() }),
      order_in_unit: z.number().nullish(),
    }),
  ),
});

export type EyfsUnits = {
  [unitSlug: string]: EYFSUnit;
};

export type EyfsPageData = {
  units: EyfsUnits;
  subjectTitle: string;
};

export type EYFSUnit = {
  title: string;
  lessons: Array<EYFSLesson>;
};

export type EYFSLesson = {
  title: string;
  slug: string;
  description?: string;
  orderInUnit?: number | null;
};
