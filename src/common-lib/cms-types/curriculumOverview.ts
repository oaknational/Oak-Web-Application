import * as z from "zod";

import { documentSchema, imageSchema } from "./base";

export const curriculumOverviewCMSSchema = z
  .object({
    id: z.string().nullish(),
    subjectPrinciples: z.string().array(),
    partnerBio: z.string(),
    curriculumPartner: z.object({
      name: z.string(),
      image: imageSchema.nullish(),
    }),
  })
  .merge(documentSchema);

export type CurriculumOverviewSanityData = z.infer<
  typeof curriculumOverviewCMSSchema
>;
