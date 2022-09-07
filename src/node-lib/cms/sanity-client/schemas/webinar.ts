import * as z from "zod";

import {
  slugSchema,
  documentSchema,
  dateSchema,
  blogWebinarCategorySchema,
  seoSchema,
} from "./base";
import { portableTextSchema } from "./portableText";
import { teamMemberPreviewSchema } from "./teamMember";

export const webinarSchema = z
  .object({
    title: z.string(),
    slug: slugSchema,
    date: dateSchema,
    hosts: z.array(teamMemberPreviewSchema),
    category: blogWebinarCategorySchema,
    summaryPortableText: portableTextSchema,
    seo: seoSchema,
  })
  .merge(documentSchema);

export type Webinar = z.infer<typeof webinarSchema>;

export const webinarPreviewSchema = webinarSchema.pick({
  id: true,
  title: true,
  slug: true,
  date: true,
  category: true,
  summaryPortableText: true,
});

export type WebinarPreview = z.infer<typeof webinarPreviewSchema>;
