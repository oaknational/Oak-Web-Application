import { z } from "zod";

export const UnitvariantLessonsSchema = z.array(
  z.object({
    lesson: z
      .object({
        features: z.object({
          agf__geo_restricted: z.boolean().optional(),
        }),
      })
      .nullable(),
  }),
);
