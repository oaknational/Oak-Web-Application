import {
  phaseDescriptions,
  subjects,
} from "@oaknational/oak-curriculum-schema";
import { z } from "zod";

const curriculumOverviewSchema = z.object({
  curriculaDesc: z.string(),
  subjectTitle: subjects,
  phaseTitle: phaseDescriptions,
  examboardTitle: z.string().nullable().optional(),
  nonCurriculum: z.boolean(),
});

export default curriculumOverviewSchema;
