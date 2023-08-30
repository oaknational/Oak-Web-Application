import { z } from "zod";

const curriculumUnitsSchema = z.object({
  units: z
    .object({
      title: z.string(),
      slug: z.string(),
      subject: z.string(),
      subject_slug: z.string(),
      phase: z.string(),
      phase_slug: z.string(),
      year: z.string(),
      examboard: z.string().nullable(),
      examboard_slug: z.string().nullable(),
      threads: z.array(
        z.object({
          title: z.string(),
          slug: z.string(),
        })
      ),
    })
    .array(),
});

export type curriculumUnitsSchema = z.infer<typeof curriculumUnitsSchema>;

export default curriculumUnitsSchema;
