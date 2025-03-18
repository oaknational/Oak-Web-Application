import { z } from "zod";

const curriculumOverviewSchema = z.object({
  curriculaDesc: z.string(),
  subjectTitle: z.string(),
  phaseTitle: z.string(),
  examboardTitle: z.string().nullable().optional(),
  non_curriculum: z.boolean(),
});

export default curriculumOverviewSchema;
