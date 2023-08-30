import * as z from "zod";

import { documentSchema, imageSchema } from "./base";

export const curriculumOverviewSchema = z
  .object({
    id: z.string().nullish(),
    subjectPrinciples: z.array(z.string()),
    partnerBio: z.string(),
    curriculumPartner: z.object({
      name: z.string(),
      image: imageSchema.nullish(),
    }),
  })
  .merge(documentSchema);

export type CurriculumOverviewPage = z.infer<typeof curriculumOverviewSchema>;
