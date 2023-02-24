import * as z from "zod";

import { documentSchema, imageSchema, seoSchema } from "./base";
import { cardSchema } from "./blocks";
import { portableTextSchema } from "./portableText";

export const homePageSchema = z
  .object({
    heading: z.string(),
    summaryPortableText: portableTextSchema,
    pupilsImage: imageSchema,
    teachersImage: imageSchema,
    sidebarCard1: cardSchema,
    sidebarCard2: cardSchema,
    sidebarForm: z
      .object({
        title: z.string(),
        bodyPortableText: portableTextSchema,
      })
      .nullish(),
    seo: seoSchema.nullish(),
  })
  .merge(documentSchema);

export type HomePage = z.infer<typeof homePageSchema>;
