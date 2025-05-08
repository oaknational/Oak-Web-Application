import * as z from "zod";

import { documentSchema, imageSchema, videoSchema } from "./base";
import { portableTextSchema } from "./portableText";

const curriculumPartnerSchema = z.object({
  name: z.string(),
  image: imageSchema.nullish(),
});

export const curriculumOverviewCMSSchema = z
  .object({
    id: z.string().nullish(),
    curriculumExplainer: z.object({
      explainerRaw: portableTextSchema.optional(),
    }),
    subjectPrinciples: z.string().array(),
    partnerBio: z.string(),
    curriculumPartner: curriculumPartnerSchema,
    curriculumPartnerOverviews: z.array(
      z.object({
        partnerBio: z.string(),
        partnerBioPortableTextRaw: portableTextSchema.nullable(),
        curriculumPartner: curriculumPartnerSchema,
      }),
    ),
    video: videoSchema.nullish(),
    videoAuthor: z.string().nullish(),
    videoExplainer: z.string().nullish(),
  })
  .merge(documentSchema);

export type CurriculumOverviewSanityData = z.infer<
  typeof curriculumOverviewCMSSchema
>;
