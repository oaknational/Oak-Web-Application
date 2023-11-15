import * as z from "zod";

import { documentSchema, imageSchema, videoSchema } from "./base";

export const curriculumOverviewCMSSchema = z
  .object({
    id: z.string().nullish(),
    subjectPrinciples: z.string().array(),
    partnerBio: z.string(),
    curriculumPartner: z.object({
      name: z.string(),
      image: imageSchema.nullish(),
    }),
    video: videoSchema.nullish(),
    videoAuthor: z.string().nullish(),
    videoExplainer: z.string().nullish(),
  })
  .merge(documentSchema);

export type CurriculumOverviewSanityData = z.infer<
  typeof curriculumOverviewCMSSchema
>;
