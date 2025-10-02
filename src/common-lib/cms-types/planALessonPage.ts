import { z } from "zod";

import { documentSchema, formSchema, imageSchema, seoSchema } from "./base";
import { portableTextSchema } from "./portableText";
import { teamMemberSchema } from "./teamMember";

export const planALessonPageSchema = z
  .object({
    hero: z.object({
      heading: z.string(),
      summaryPortableText: portableTextSchema.nullish(),
      image: imageSchema.nullish(),
      author: teamMemberSchema,
    }),
    content: z.array(
      z.discriminatedUnion("type", [
        z.object({
          type: z.literal("PlanALessonPageContent"),
          bodyPortableText: portableTextSchema,
          navigationTitle: z.string(),
          anchorSlug: z.object({ current: z.string() }),
        }),
        z.object({
          type: z.literal("PlanALessonPageFormBlock"),
          navigationTitle: z.string(),
          bodyPortableText: portableTextSchema,
          form: formSchema,
        }),
      ]),
    ),

    seo: seoSchema.nullish(),
  })
  .extend(documentSchema.shape);

export type PlanALessonPage = z.infer<typeof planALessonPageSchema>;
