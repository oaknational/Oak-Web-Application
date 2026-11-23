import { z } from "zod";
import {
  keystageSlugs,
  subjectSlugs,
} from "@oaknational/oak-curriculum-schema";

import {
  canonicalLessonHubPathwaySchema,
  canonicalLessonHubSchema,
} from "../canonicalLessonOverview/canonicalLessonOverview.schema";

export const canonicalLessonMediaSchema = canonicalLessonHubSchema.extend({
  pathways: z.array(
    canonicalLessonHubPathwaySchema.extend({
      keyStageSlug: keystageSlugs,
      subjectSlug: subjectSlugs,
    }),
  ),
});

export type CanonicalLessonMediaData = z.infer<
  typeof canonicalLessonMediaSchema
>;
